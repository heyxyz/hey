import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import { boolean, object, string } from 'zod';

import { VERIFIED_FEATURE_ID, VERIFIED_KV_KEY } from '../constants';
import validateIsStaff from '../helpers/validateIsStaff';
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

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  if (!(await validateIsStaff(request))) {
    return response({ success: false, error: Errors.NotStaff });
  }

  const { id, profile_id, enabled } = body as ExtensionRequest;

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    if (id === VERIFIED_FEATURE_ID) {
      // Clear cache in Cloudflare KV
      await request.env.PREFERENCES.delete(VERIFIED_KV_KEY);
    }

    if (enabled) {
      const { error: upsertError } = await client
        .from('profile-features')
        .upsert({ feature_id: id, profile_id: profile_id })
        .select();

      if (upsertError) {
        throw upsertError;
      }

      return response({ success: true, enabled });
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

    return response({ success: true, enabled });
  } catch (error) {
    throw error;
  }
};
