import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import prisma from 'src/lib/prisma';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return noBody(res);
  }

  try {
    const data = await prisma.group.findUnique({
      where: { slug: slug as string }
    });
    logger.info('Group fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
