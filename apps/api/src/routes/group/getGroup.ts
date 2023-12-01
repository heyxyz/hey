import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const data = await prisma.group.findUnique({
      where: { slug: slug as string }
    });
    logger.info('Group fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, result: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
