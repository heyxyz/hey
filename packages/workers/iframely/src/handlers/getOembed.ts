import type { IRequest } from 'itty-router';

import { getMeta } from '../helper/metadata';

export default async (request: IRequest) => {
  try {
    const url = request.query.url as string;
    const data = await getMeta(url as string);

    return new Response(JSON.stringify({ success: true, oembed: data }));
  } catch (error) {
    console.error('Failed to get iframely data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
