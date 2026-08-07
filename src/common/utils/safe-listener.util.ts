import { Logger } from '@nestjs/common';

const logger = new Logger('SafeListener');

export async function safeListener(
  listenerName: string,
  eventName: string,
  fn: () => Promise<void> | void,
) {
  try {
    await fn();
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Error in listener "${listenerName}" for event "${eventName}": ${err.message}`,
      err.stack,
    );
  }
}
