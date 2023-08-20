import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';

import createSupabaseClient from '../helpers/createSupabaseClient';
import type { Env } from '../types';

export default async (id: string, env: Env) => {
  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createSupabaseClient(env);

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
