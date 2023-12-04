import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const unlonelyResponse = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        body: JSON.stringify({
          query: `
            query GetNFC {
              getNFC(id: "${id}") {
                id
                createdAt 
                videoLink
                videoThumbnail
                openseaLink
                title
                owner {
                  username
                  FCImageUrl
                  lensImageUrl
                }
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
    const nfc: {
      data: { getNFC: any };
    } = await unlonelyResponse.json();
    logger.info('NFC fetched from Unlonely');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        nfc: nfc.data.getNFC,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
