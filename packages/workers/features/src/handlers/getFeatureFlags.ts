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
    const cacheKey = `features:${id}`;
    const cache = await request.env.FEATURES.get(cacheKey);

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);

      const { data, error } = await client
        .from('profile-features')
        .select('profile_id, enabled, features!inner(key, enabled)')
        .eq('features.enabled', true)
        .eq('profile_id', id)
        .eq('enabled', true);

      if (error) {
        throw error;
      }

      const features = data.map((feature: any) => feature.features?.key);
      await request.env.FEATURES.put(cacheKey, JSON.stringify(features));

      return response({ success: true, features });
    }

    return response({
      success: true,
      fromKV: true,
      features: JSON.parse(cache)
    });
  } catch (error) {
    throw error;
  }
};
