import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const basePaintResponse = await fetch('https://basepaint.art/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Hey.xyz'
      },
      body: JSON.stringify({
        query: `
          query Canvas {
            canvass(first: 1, orderDirection: "ASC") {
              id
            }
            canvas(id: ${id}) {
              id
              palette
              theme
              totalEarned
              totalMints
              pixelsCount
              bitmap {
                gif
              }
              contributions(first: 1000, orderBy: "pixelsCount", orderDirection: "ASC") {
                id
              }
            }
          }
        `
      })
    });
    const canvas: {
      data: {
        canvass: { id: number }[];
        canvas: any;
      };
    } = await basePaintResponse.json();
    const numberId = parseInt(id as string);
    const currentCanvas = canvas.data.canvass[0].id;
    logger.info('Canvas fetched from BasePaint');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        canvas:
          {
            canContribute: currentCanvas === numberId,
            canMint: currentCanvas - 1 === numberId,
            ...canvas.data.canvas
          } || null
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
