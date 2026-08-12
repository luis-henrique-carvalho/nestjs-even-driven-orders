import { Module } from '@nestjs/common';
import { InventoryProcessor } from './iventory.processor';

@Module({
  providers: [InventoryProcessor],
})
export class InventoryModule {}
