import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  try {
    const cache = await request.env.VERIFIED.get('list');

    if (!cache) {
      const client = createSupabaseClient(request.env.SUPABASE_KEY);
      const { data, error } = await client.from('verified').select('*');

      if (error) {
        throw error;
      }

      const ids = data.map((item) => item.id);
      await request.env.VERIFIED.put('list', JSON.stringify(ids));

      return response({ success: true, result: ids });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
