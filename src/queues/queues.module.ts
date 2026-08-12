import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QUEUE_NAMES } from './queues.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.ORDER_EVENTS,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.ORDER_EVENTS,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
