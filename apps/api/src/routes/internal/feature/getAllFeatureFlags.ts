import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (_req, res) => {
  try {
    const data = await prisma.feature.findMany({
      orderBy: { priority: 'desc' }
    });
    logger.info('All features fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, features: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
