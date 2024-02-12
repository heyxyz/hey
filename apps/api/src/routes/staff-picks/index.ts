import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_SECS_30_DAYS } from 'src/lib/constants';
import prisma from 'src/lib/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.staffPick.findMany({
      take: 30
    });
    const random = data.sort(() => Math.random() - Math.random());
    const picks = random.slice(0, 5);

    logger.info('Staff picks fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_SECS_30_DAYS)
      .json({ result: picks, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
