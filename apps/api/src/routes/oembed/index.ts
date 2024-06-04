import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/helpers/constants';
import getMetadata from 'src/helpers/oembed/getMetadata';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return noBody(res);
  }

  try {
    const oembed = await getMetadata(url as string);
    const skipCache = oembed.frame !== null;

    logger.info(`Oembed generated for ${url}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        skipCache ? 'no-cache' : SWR_CACHE_AGE_10_MINS_30_DAYS
      )
      .json({ oembed, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
