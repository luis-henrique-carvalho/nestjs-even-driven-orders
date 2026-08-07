import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { ORDER_EVENTS } from '../orders/events/order-events.constants';
import { safeListener } from 'src/common/utils/safe-listener.util';

@Injectable()
export class InventoryListener {
  private readonly logger = new Logger(InventoryListener.name);

  @OnEvent(ORDER_EVENTS.CREATED)
  async handleOrderCreatedEvent(event: OrderCreatedEvent): Promise<void> {
    await safeListener(InventoryListener.name, ORDER_EVENTS.CREATED, () => {
      this.logger.log(
        `Received order.created event for Order ID: ${event.orderId}, User ID: ${event.userId},
       Total: ${event.total}`,
      );

      for (const item of event.items) {
        this.logger.log(
          `-> reserved ${item.quantity} units of Product ID: ${item.productId} at Unit Price: ${item.unitPrice}`,
        );
      }

      this.logger.log(`Inventory updated for Order ID: ${event.orderId}`);
    });
  }
}
