import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';
import createSupabaseClient from '@lenster/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { id } = request.params;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data } = await client
      .from('rights')
      .select('*')
      .eq('id', id)
      .single();

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
