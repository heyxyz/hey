import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS } from 'src/helpers/constants';
import prisma from 'src/helpers/prisma';
import {
  generateMediumExpiry,
  getRedis,
  setRedis
} from 'src/helpers/redisClient';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const cacheKey = `pro:${id}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      logger.info(`(cached) Fetched pro status for ${id}`);

      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_30_MINS)
        .json({ result: JSON.parse(cachedData), success: true });
    }

    const pro = await prisma.pro.findUnique({
      where: { id: id as string }
    });

    if (!pro) {
      return res
        .status(200)
        .json({ result: { expiresAt: null, isPro: false } });
    }

    const result = { expiresAt: pro.expiresAt, isPro: true };

    await setRedis(cacheKey, result, generateMediumExpiry());
    logger.info(`Fetched pro status for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_MINS)
      .json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
