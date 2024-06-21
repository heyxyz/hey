import type { Address } from 'viem';

import logger from '@hey/helpers/logger';
import { StackClient } from '@stackso/js-core';

const stack = new StackClient({
  apiKey: process.env.STACK_API_KEY!,
  pointSystemId: 2716
});

const syncToStack = async (address: Address, score: number) => {
  try {
    const oldPoints = await stack.getPoints(address);
    const upsertingPoints = score - oldPoints;

    if (upsertingPoints > 0) {
      const { messageId } = await stack.track('UPDATE', {
        account: address,
        points: upsertingPoints
      });

      logger.info(
        `Stack: Synced points to Stack for ${address} - ${oldPoints} -> ${score} - ${messageId}`
      );

      return true;
    }

    logger.info(`Stack: Skipped syncing to Stack for ${address}`);

    return true;
  } catch (error) {
    logger.error(
      `Stack: Failed to sync points to Stack for ${address}`,
      error as Error
    );

    return false;
  }
};

export default syncToStack;
