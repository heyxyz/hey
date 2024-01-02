import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { handle, slug } = req.query;

  if (!handle || !slug) {
    return noBody(res);
  }

  try {
    const soundResponse = await fetch('https://api.sound.xyz/graphql', {
      body: JSON.stringify({
        operationName: 'MintedRelease',
        query: `
          query MintedRelease($releaseSlug: String!, $soundHandle: String!) {
            mintedRelease(releaseSlug: $releaseSlug, soundHandle: $soundHandle) {
              title
              numSold
              coverImage {
                url
                dominantColor
              }
              track {
                normalizedPeaks
                audio {
                  audio256k {
                    url
                  }
                }
              }
              artist {
                name
                user {
                  avatar {
                    url
                  }
                }
              }
            }
          }
        `,
        variables: { releaseSlug: slug, soundHandle: handle }
      }),
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Hey.xyz',
        'X-Sound-Client-Key': process.env.SOUND_API_KEY!
      },
      method: 'POST'
    });
    const release: { data: { mintedRelease: any } } =
      await soundResponse.json();

    logger.info('Release fetched from Sound.xyz');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        release: release.data.mintedRelease,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
