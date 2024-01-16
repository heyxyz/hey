import type { Handler } from 'express';

import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const allResponses = await Promise.all([
      fetch('https://ponder.basepaint.xyz', {
        body: JSON.stringify({
          operationName: 'Canvas',
          query: `
          query Canvas($id: Int!) {
            canvass(first: 1, orderDirection: "ASC") {
              id
            }
            canvas(id: $id) {
              id
              totalEarned
              totalMints
              pixelsCount
              contributions(first: 1000, orderBy: "pixelsCount", orderDirection: "ASC") {
                id
              }
            }
          }
        `,
          variables: {
            id: parseInt(id as string)
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'Hey.xyz'
        },
        method: 'POST'
      }),
      fetch(
        `https://basepaint.art/api/trpc/themes.theme?batch=1&input=${encodeURIComponent(
          JSON.stringify({ 0: { json: { day: parseInt(id as string) } } })
        )}`
      )
    ]);

    const canvas: {
      data: {
        canvas: any;
        canvass: { id: number }[];
      };
    } = await allResponses[0].json();
    const numberId = parseInt(id as string);
    const currentCanvas = canvas.data.canvass[0].id;

    const themes: {
      result: { data: { json: { palette: string[]; theme: string } } };
    }[] = await allResponses[1].json();

    const { palette, theme } = themes[0].result.data.json;

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        canvas:
          {
            canContribute: currentCanvas === numberId,
            canMint: currentCanvas - 1 === numberId,
            palette,
            theme,
            ...canvas.data.canvas
          } || null,
        success: true
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
