import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (_req, res) => {
  try {
    const data = await prisma.group.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' }
    });
    logger.info('Featured groups fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, result: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
