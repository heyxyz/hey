import '@sentry/tracing';

import response from '@lenster/lib/response';

import createSupabaseClient from '../helpers/createSupabaseClient';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const transaction = request.sentry?.startTransaction({
    name: '@lenster/channels/getChannels'
  });

  try {
    const cache = await request.env.CHANNELS.get('channels-list');

    if (!cache) {
      const client = createSupabaseClient(request.env);
      const { data } = await client.from('channels').select('*');
      await request.env.CHANNELS.put('channels-list', JSON.stringify(data));

      return response({ success: true, result: data });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    request.sentry?.captureException(error);
    throw error;
  } finally {
    transaction?.finish();
  }
};
