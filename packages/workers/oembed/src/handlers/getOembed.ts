import type { IRequest } from 'itty-router';

import getMetadata from '../helper/getMetadata';
import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const url = request.query.url as string;
    const data = await getMetadata(url as string, env);

    return new Response(JSON.stringify({ success: true, oembed: data }));
  } catch (error) {
    console.error('Failed to get oembed data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
