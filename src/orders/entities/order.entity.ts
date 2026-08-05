import { OrderItemDto } from '../dto/create-order.dto';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export class Order {
  id!: string;
  userId!: string;
  items!: OrderItemDto[];
  status!: OrderStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
