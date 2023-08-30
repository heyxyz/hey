import '@sentry/tracing';

import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';

import createSupabaseClient from '../helpers/createSupabaseClient';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const transaction = request.sentry?.startTransaction({
    name: '@lenster/preferences/getPreferences'
  });

  const { id } = request.params;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(request.env);

    const { data } = await client
      .from('rights')
      .select('*')
      .eq('id', id)
      .single();

    return response({ success: true, result: data });
  } catch (error) {
    request.sentry?.captureException(error);
    throw error;
  } finally {
    transaction?.finish();
  }
};
