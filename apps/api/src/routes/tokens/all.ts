import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'src/helpers/constants';
import prisma from 'src/helpers/prisma';

export const get: Handler = async (_, res) => {
  try {
    const data = await prisma.allowedToken.findMany({
      orderBy: { priority: 'desc' }
    });
    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({ success: true, tokens: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
