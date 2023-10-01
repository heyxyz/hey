import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import { STAFFPICKS_KV_KEY } from '../constants';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const cache = await request.env.STAFFPICKS.get(STAFFPICKS_KV_KEY);

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);

      const { data } = await client
        .from('staff-picks')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      await request.env.STAFFPICKS.put(STAFFPICKS_KV_KEY, JSON.stringify(data));

      return response({ success: true, result: data });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};
