import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { data } = await client
      .from('pro')
      .delete()
      .lte('expires_at', new Date().toISOString());

    return response({
      success: true,
      result: data
    });
  } catch (error) {
    throw error;
  }
};
