import response from '@lenster/lib/response';
import type { IRequest } from 'itty-router';

import createSupabaseClient from '../helpers/createSupabaseClient';
import type { Env } from '../types';

export default async (_: IRequest, env: Env) => {
  try {
    const cache = await env.verified.get('list');

    if (!cache) {
      const client = createSupabaseClient(env);

      const { data } = await client
        .from('rights')
        .select('id')
        .eq('is_verified', true);

      const ids = data?.map((right) => right.id);
      await env.verified.put('list', JSON.stringify(ids));

      return response({ success: true, result: ids });
    }

    return response({ success: true, fromKV: true, result: JSON.parse(cache) });
  } catch (error) {
    throw error;
  }
};
