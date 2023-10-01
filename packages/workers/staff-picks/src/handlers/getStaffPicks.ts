import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data } = await client
      .from('staff-picks')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
