import type { Address } from 'viem';

import logger from '@hey/helpers/logger';
import { StackClient } from '@stackso/js-core';

const stack = new StackClient({
  apiKey: process.env.STACK_API_KEY!,
  pointSystemId: 2716
});

const syncToStack = async (address: Address, score: number) => {
  const maxRetries = 5;
  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    attempt++;
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

        success = true;
        return true;
      }

      logger.info(`Stack: Skipped syncing to Stack for ${address}`);
      success = true;
      return true;
    } catch (error) {
      logger.error(
        `Stack: Failed to sync points to Stack for ${address} on attempt ${attempt}`,
        error as Error
      );

      if (attempt >= maxRetries) {
        return false;
      }
    }
  }
};

export default syncToStack;
