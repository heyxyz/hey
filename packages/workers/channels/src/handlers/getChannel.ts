import response from '@lenster/lib/response';
import createSupabaseClient from '@lenster/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { slug } = request.params;

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { data } = await client
      .from('channels')
      .select('*')
      .eq('slug', slug)
      .single();

    const membersCountRequest = await fetch(
      `https://mint.fun/api/mintfun/contract/7777777:${data?.contract?.toLowerCase()}/details`
    );

    const json: {
      details: { minterCount: string };
    } = await membersCountRequest.json();

    return response({
      success: true,
      result: { ...data, members: parseInt(json.details.minterCount || '0') }
    });
  } catch (error) {
    throw error;
  }
};
