import { Module } from '@nestjs/common';
import { InventoryListener } from './iventory.listener';

@Module({
  providers: [InventoryListener],
  exports: [InventoryListener],
})
export class InventoryModule {}
