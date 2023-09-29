import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { id } = request.query;

  if (!id) {
    return response({ success: false, error: 'No id provided' });
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

    return response({
      success: true,
      canvas:
        {
          canContribute: currentCanvas === numberId,
          canMint: currentCanvas - 1 === numberId,
          ...canvas.data.canvas
        } || null
    });
  } catch (error) {
    throw error;
  }
};
