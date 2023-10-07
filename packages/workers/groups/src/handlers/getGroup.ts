import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { slug } = request.params;

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { data } = await client
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .single();

    return response({
      success: true,
      result: data
    });
  } catch (error) {
    throw error;
  }
};
