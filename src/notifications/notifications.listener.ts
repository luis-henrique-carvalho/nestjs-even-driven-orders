import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constants';

@Injectable()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  @OnEvent(ORDER_EVENTS.CREATED)
  handleOrderCreatedEvent(event: OrderCreatedEvent): void {
    this.logger.log(
      `Sending confirmation email for order ${event.orderId} to user ${event.userId}`,
    );

    this.logger.log(
      `Confirmation email queued for order ${event.orderId} - total: ${event.total}, items: ${event.items.length}, created at: ${event.createdAt.toISOString()}`,
    );
  }
}
