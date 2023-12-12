import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.verified.findMany({
      select: { id: true }
    });

    const ids = data.map((item: any) => item.id);
    logger.info('Verified profiles fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: ids, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
