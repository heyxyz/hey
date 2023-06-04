import { decode } from '@cfworker/base64url';
import type { IRequest } from 'itty-router';

import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const hash = request.query.hash as string;
    const transform = request.query.transform as 'square' | 'large' | string;
    const url = decode(hash);
    const isSquare = transform === 'square';
    const height = isSquare ? 400 : 600;
    const width = isSquare ? 400 : 'auto';
    const image = await fetch(
      `${env.IMAGEKIT_URL}/tr:di-placeholder.webp,h-${height},w-${width}/${url}`,
      {
        cf: {
          cacheTtl: 60 * 60 * 24 * 7,
          cacheEverything: true
        }
      }
    );

    return new Response(image.body);
  } catch (error) {
    console.error('Failed to get oembed data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
