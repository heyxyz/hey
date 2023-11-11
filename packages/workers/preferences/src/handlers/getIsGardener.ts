import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import { GARDENER_FEATURE_ID } from '../constants';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('profile-features')
      .select('profile_id, enabled')
      .eq('profile_id', id)
      .eq('feature_id', GARDENER_FEATURE_ID)
      .eq('enabled', true)
      .single();

    if (error) {
      return response({ success: true, enable: false });
    }

    return response({ success: true, enable: data.enabled });
  } catch (error) {
    throw error;
  }
};
