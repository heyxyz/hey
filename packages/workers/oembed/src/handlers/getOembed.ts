import response from '@lenster/lib/response';
import type { IRequest } from 'itty-router';

import getMetadata from '../helper/getMetadata';
import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  try {
    const url = request.query.url as string;
    const data = await getMetadata(url as string, env);

    return response({ success: true, oembed: data });
  } catch (error) {
    throw error;
  }
};
