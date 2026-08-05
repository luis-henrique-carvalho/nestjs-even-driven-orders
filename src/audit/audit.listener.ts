import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event';
import { AuditLogEntry } from './audit-log-entry';

@Injectable()
export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  private readonly auditLogs: AuditLogEntry[] = [];

  @OnEvent('order.*')
  handleOrderNamespaceEvents(event: OrderCreatedEvent): void {
    const auditLogEntry: AuditLogEntry = {
      orderId: event.orderId,
      eventNamespace: 'order.*',
      capturedAt: new Date(),
      summary: `Order ${event.orderId} created by User ${event.userId} with total ${event.total} items: ${event.items.length} at ${event.createdAt.toISOString()}`,
    };

    this.auditLogs.push(auditLogEntry);

    this.logger.log(`Audit log entry recorded: ${auditLogEntry.summary}`);
  }

  findAll(): AuditLogEntry[] {
    return this.auditLogs;
  }
}
