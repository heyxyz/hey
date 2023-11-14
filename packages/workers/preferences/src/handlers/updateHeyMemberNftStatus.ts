import parseJwt from '@hey/lib/parseJwt';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const accessToken = request.headers.get('X-Access-Token');

  try {
    const payload = parseJwt(accessToken as string);
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('membership-nft')
      .upsert({ id: payload.evmAddress, dismissedOrMinted: true })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return response({ success: true, result: data });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
