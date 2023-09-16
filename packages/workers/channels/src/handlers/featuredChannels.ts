import response from '@lenster/lib/response';
import createSupabaseClient from '@lenster/supabase/createSupabaseClient';

import { FEATURED_CHANNELS_KV_KEY } from '../constants';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const cache = await request.env.CHANNELS.get(FEATURED_CHANNELS_KV_KEY);

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);
      const { data } = await client
        .from('channels')
        .select('*, members:channel_memberships(count)')
        .eq('featured', true);
      await request.env.CHANNELS.put(
        FEATURED_CHANNELS_KV_KEY,
        JSON.stringify(data)
      );

      return response({ success: true, result: data });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};
