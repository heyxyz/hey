import { Errors } from '@hey/data/errors';
import { adminAddresses } from '@hey/data/staffs';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id: string;
  profile_id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  profile_id: string(),
  enabled: boolean()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const accessToken = request.headers.get('X-Access-Token');
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { id, profile_id, enabled } = body as ExtensionRequest;

  try {
    const { payload } = jwt.decode(accessToken as string);
    if (!adminAddresses.includes(payload.evmAddress)) {
      return response({ success: false, error: Errors.NotAdmin });
    }

    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    if (enabled) {
      const { error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: id, profile_id: profile_id, enabled })
        .select();

      if (upsertError) {
        throw upsertError;
      }

      return response({ success: true });
    }

    const { error: deleteError } = await client
      .from('profile-features')
      .delete()
      .eq('feature_id', id)
      .eq('profile_id', profile_id)
      .select();

    if (deleteError) {
      throw deleteError;
    }

    return response({ success: true });
  } catch (error) {
    throw error;
  }
};
