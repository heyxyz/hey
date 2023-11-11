import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import { VERIFIED_FEATURE_ID, VERIFIED_KV_KEY } from '../constants';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const cache = await request.env.PREFERENCES.get(VERIFIED_KV_KEY);

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);

      const { data, error } = await client
        .from('profile-features')
        .select('*')
        .eq('feature_id', VERIFIED_FEATURE_ID)
        .eq('enabled', true);

      if (error) {
        throw error;
      }

      const ids = data.map((item) => item.profile_id);
      await request.env.PREFERENCES.put(VERIFIED_KV_KEY, JSON.stringify(ids));

      return response({ success: true, result: ids });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};
