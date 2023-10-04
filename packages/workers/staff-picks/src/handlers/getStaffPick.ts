import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { id } = request.params;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data } = await client
      .from('staff-picks')
      .select('*')
      .eq('id', id)
      .single();

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
