import response from '@lenster/lib/response';
import createSupabaseClient from '@lenster/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { slug } = request.params;

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { data } = await client
      .from('channels')
      .select('*, members:channel_memberships(count)')
      .eq('slug', slug)
      .single();

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
