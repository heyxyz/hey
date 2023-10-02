import { Errors } from '@hey/data/errors';
import hasOwnedLensProfiles from '@hey/lib/hasOwnedLensProfiles';
import response from '@hey/lib/response';
import validateLensAccount from '@hey/lib/validateLensAccount';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id: string;
  enabled: boolean;
};

const validationSchema = object({
  id: string(),
  enabled: boolean()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const accessToken = request.headers.get('X-Access-Token');
  if (!accessToken) {
    return response({ success: false, error: Errors.NoAccessToken });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { id, enabled } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return response({ success: false, error: Errors.InvalidAccesstoken });
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(payload.id, id, true);
    if (!hasOwned) {
      return response({ success: false, error: Errors.InvalidProfileId });
    }

    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('rights')
      .update({ staff_mode: enabled })
      .eq('is_staff', true)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return response({ success: true, result: data });
  } catch (error) {
    throw error;
  }
};
