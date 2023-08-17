import response from '@lenster/lib/response';
import type { IRequest } from 'itty-router';

import getMetadata from '../helper/getMetadata';
import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  const url = request.query.url as string;

  if (!url) {
    return response({ success: false, error: 'No URL provided' });
  }

  try {
    const data = await getMetadata(url as string, env);

    return response({ success: true, oembed: data });
  } catch (error) {
    throw error;
  }
};
