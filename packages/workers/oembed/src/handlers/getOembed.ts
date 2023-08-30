import '@sentry/tracing';

import response from '@lenster/lib/response';

import getMetadata from '../helper/getMetadata';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const transaction = request.sentry?.startTransaction({
    name: '@lenster/oembed/getOembed'
  });

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
    request.sentry?.captureException(error);
    throw error;
  } finally {
    transaction?.finish();
  }
};
