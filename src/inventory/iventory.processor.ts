import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constants';
import { QUEUE_NAMES } from 'src/queues/queues.constants';

@Processor(QUEUE_NAMES.ORDER_EVENTS)
export class InventoryProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryProcessor.name);

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) {
      return;
    }

    const event = job.data;

    this.logger.log(
      `Reserving stock for order ${event.orderId} (${event.items.length} item(s)) [attempt ${job.attemptsMade + 1}/${job.opts.attempts}]`,
    );

    for (const item of event.items) {
      this.logger.log(
        `-> reserved ${item.quantity} units of Product ID: ${item.productId} at Unit Price: ${item.unitPrice}`,
      );
    }

    this.logger.log(`Stock reservation completed for order ${event.orderId}`);

    await Promise.resolve();
  }
}
