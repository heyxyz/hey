import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  enabled: boolean;
};

const validationSchema = object({
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

  const { enabled } = body as ExtensionRequest;

  try {
    const { payload } = jwt.decode(accessToken as string);
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const staffModeFeatureId = '0e588583-b347-4752-9e1e-0ad4128348e8';
    const staffFeatureId = 'eea3b2d2-a60c-4e41-8130-1cb34cc37810';
    const profile_id = payload.id;

    if (enabled) {
      const { data: upsertData, error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: staffModeFeatureId, profile_id: '0x08' })
        .match({ feature_id: staffFeatureId, profile_id: '0x08' })
        .select()
        .single();

      if (upsertError) {
        throw upsertError;
      }

      return response({ success: true, upsertData, enabled });
    }

    const { data: deleteData, error: deleteError } = await client
      .from('profile-features')
      .delete()
      .eq('feature_id', staffModeFeatureId)
      .eq('profile_id', profile_id)
      .match({ feature_id: staffFeatureId, profile_id })
      .select();

    if (deleteError) {
      throw deleteError;
    }

    return response({ success: true, deleteData, enabled });
  } catch (error) {
    throw error;
  }
};
