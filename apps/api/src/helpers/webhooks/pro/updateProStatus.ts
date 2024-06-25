import type { Address, PublicClient } from 'viem';

import logger from '@hey/helpers/logger';
import getRpc from 'src/helpers/getRpc';
import prisma from 'src/helpers/prisma';
import { createPublicClient, formatEther } from 'viem';
import { polygon } from 'viem/chains';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTransactionWithRetry = async (
  client: PublicClient,
  hash: Address,
  retries: number = MAX_RETRIES
): Promise<any> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await client.getTransaction({ hash });
    } catch {
      if (attempt < retries) {
        logger.error(
          `updateProStatus: Attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
        );
        await sleep(RETRY_DELAY_MS);
      } else {
        throw new Error(`updateProStatus: Failed after ${retries} attempts`);
      }
    }
  }
};

const updateProStatus = async (hash: Address) => {
  if (!hash) {
    throw new Error('updateProStatus: No transaction hash provided');
  }

  logger.info(`updateProStatus: Fetching transaction receipt for ${hash}`);

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: getRpc({ mainnet: true })
    });

    const transaction = await fetchTransactionWithRetry(client, hash);
    const id = transaction.input;
    const dailyRate = 0.333;
    const value = parseFloat(formatEther(transaction.value));
    const numberOfDays = Math.round(value / dailyRate);
    const newExpiry = new Date(Date.now() + numberOfDays * 24 * 60 * 60 * 1000);

    if (!id) {
      throw new Error('updateProStatus: No profile ID found');
    }

    const existingPro = await prisma.pro.findUnique({ where: { id } });

    let expiresAt: Date;
    if (existingPro) {
      // Extend the expiration date if the user already has a subscription
      expiresAt = new Date(
        existingPro.expiresAt.getTime() + numberOfDays * 24 * 60 * 60 * 1000
      );
    } else {
      // Set a new expiration date if the user does not have a subscription
      expiresAt = newExpiry;
    }

    const data = await prisma.pro.upsert({
      create: { expiresAt, id },
      update: { expiresAt },
      where: { id }
    });

    logger.info(
      `updateProStatus: Updated Pro status for ${id} to ${expiresAt}`
    );

    return data;
  } catch (error) {
    throw new Error(`updateProStatus: Failed to update Pro status: ${error}`);
  }
};

export default updateProStatus;
