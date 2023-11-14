import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const cacheKey = `preferences:${id}`;
    const cache = await request.env.PREFERENCES.get(cacheKey);

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);
      const { data } = await client
        .from('rights')
        .select('*')
        .eq('id', id)
        .single();
      await request.env.PREFERENCES.put(cacheKey, JSON.stringify(data));

      return response({ success: true, result: data });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};
