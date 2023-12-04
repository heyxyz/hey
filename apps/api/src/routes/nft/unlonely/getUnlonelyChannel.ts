import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return noBody(res);
  }

  try {
    const unlonelyResponse = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        body: JSON.stringify({
          query: `
            query GetChannelBySlug {
              getChannelBySlug(slug: "${slug}") {
                id
                slug
                name
                description
                playbackUrl
                isLive
              }
            }
          `
        }),
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'Hey.xyz'
        },
        method: 'POST'
      }
    );
    const channel: {
      data: { getChannelBySlug: any };
    } = await unlonelyResponse.json();
    logger.info('Channel fetched from Unlonely');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        channel: channel.data.getChannelBySlug,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
