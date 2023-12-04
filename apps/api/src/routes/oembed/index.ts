import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { CACHE_AGE_30_DAYS } from '@utils/constants';
import getMetadata from '@utils/oembed/getMetadata';
import { noBody } from '@utils/responses';

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
        oembed: await getMetadata(url as string),
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
