import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.allowedToken.findMany({
      orderBy: { createdAt: 'desc' }
    });
    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, tokens: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
