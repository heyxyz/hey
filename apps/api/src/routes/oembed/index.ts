import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { CACHE_AGE_30_DAYS } from '@utils/constants';
import getMetadata from '@utils/oembed/getMetadata';
import { noBody } from '@utils/responses';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return noBody(res);
  }

  try {
    logger.info(`Oembed generated for ${url}`);
    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_DAYS)
      .json({
        success: true,
        oembed: await getMetadata(url as string)
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
