import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import { FEATURED_GROUPS_KV_KEY } from '../constants';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const cache = await request.env.GROUPS.get(FEATURED_GROUPS_KV_KEY);

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);
      const { data } = await client
        .from('groups')
        .select('*')
        .eq('featured', true);
      await request.env.GROUPS.put(
        FEATURED_GROUPS_KV_KEY,
        JSON.stringify(data)
      );

      return response({ success: true, result: data });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};
