import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_5_MINS_30_DAYS } from 'src/lib/constants';
import prisma from 'src/lib/prisma';

export const get: Handler = async (req, res) => {
  try {
    const data = await prisma.feature.findMany({
      select: { key: true },
      where: { enabled: true, type: 'KILL_SWITCH' }
    });

    logger.info('Kill switches fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_5_MINS_30_DAYS)
      .json({
        result: data.map(({ key }) => key),
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
