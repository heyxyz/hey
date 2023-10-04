import response from '@hey/lib/response';

import getMetadata from '../helper/getMetadata';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const url = request.query.url as string;

  if (!url) {
    return response({ success: false, error: 'No URL provided' });
  }

  try {
    return response({
      success: true,
      oembed: await getMetadata(url as string, request.env)
    });
  } catch (error) {
    throw error;
  }
};
