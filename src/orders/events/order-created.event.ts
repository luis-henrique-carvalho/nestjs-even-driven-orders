import { OrderItemDto } from '../dto/create-order.dto';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: OrderItemDto[],
    public readonly total: number,
    public readonly createdAt: Date = new Date(),
  ) {}
}
