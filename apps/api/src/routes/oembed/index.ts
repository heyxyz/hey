import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import getMetadata from 'src/lib/oembed/getMetadata';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return noBody(res);
  }

  try {
    logger.info(`Oembed generated for ${url}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({
        oembed: await getMetadata(url as string),
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
