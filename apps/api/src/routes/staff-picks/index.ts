import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import prisma from 'src/lib/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.staffPick.findMany({
      orderBy: { score: 'desc' },
      take: 7,
      where: { score: { not: 0 } }
    });
    logger.info('Staff picks fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
