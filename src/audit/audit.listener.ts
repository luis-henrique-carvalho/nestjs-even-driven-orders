import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { AuditLogEntry } from './audit-log-entry';
import { safeListener } from 'src/common/utils/safe-listener.util';

@Injectable()
export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  private readonly auditLogs: AuditLogEntry[] = [];

  @OnEvent('order.*')
  async handleOrderNamespaceEvents(event: OrderCreatedEvent): Promise<void> {
    await safeListener(AuditListener.name, 'order.*', () => {
      const auditLogEntry: AuditLogEntry = {
        orderId: event.orderId,
        eventNamespace: 'order.*',
        capturedAt: new Date(),
        summary: `Order ${event.orderId} created by User ${event.userId} with total ${event.total} items: ${event.items.length} at ${event.createdAt.toISOString()}`,
      };

      this.auditLogs.push(auditLogEntry);

      this.logger.log(`Audit log entry recorded: ${auditLogEntry.summary}`);
    });
  }

  findAll(): AuditLogEntry[] {
    return this.auditLogs;
  }
}
