import { Injectable, Logger } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';
import { ORDER_EVENTS } from './events/order-events.constants';
import { OrderCreatedEvent } from './events/order-created.event';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/queues/queues.constants';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  private orders: Order[] = [];

  // constructor(private readonly eventEmitter: EventEmitter2) {}
  constructor(
    @InjectQueue(QUEUE_NAMES.ORDER_EVENTS)
    private readonly orderEventsQueue: Queue,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const total = createOrderDto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const order: Order = {
      id: randomUUID(),
      userId: createOrderDto.userId,
      items: createOrderDto.items,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.push(order);
    this.logger.log(`Order created with ID: ${order.id}, Total: ${total}`);

    // this.eventEmitter.emit(
    //   ORDER_EVENTS.CREATED,
    //   new OrderCreatedEvent(order.id, order.userId, order.items, total),
    // );

    await this.orderEventsQueue.add(
      ORDER_EVENTS.CREATED,
      new OrderCreatedEvent(order.id, order.userId, order.items, total),
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: false,
      },
    );

    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }
}
