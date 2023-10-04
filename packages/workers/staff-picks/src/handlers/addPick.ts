import { Errors } from '@hey/data/errors';
import hasOwnedLensProfiles from '@hey/lib/hasOwnedLensProfiles';
import response from '@hey/lib/response';
import validateLensAccount from '@hey/lib/validateLensAccount';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { number, object, string } from 'zod';

import { STAFFPICKS_KV_KEY } from '../constants';
import checkIsStaffFromDb from '../helpers/checkIsStaffFromDb';
import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id: string;
  picker_id: string;
  type: string;
  score: number;
};

const validationSchema = object({
  id: string(),
  picker_id: string(),
  type: string(),
  score: number()
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

  const { id, picker_id, score, type } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return response({ success: false, error: Errors.InvalidAccesstoken });
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(payload.id, picker_id, true);
    if (!hasOwned) {
      return response({ success: false, error: Errors.InvalidProfileId });
    }

    const isStaffOnDb = await checkIsStaffFromDb(request, picker_id);
    if (!isStaffOnDb) {
      return response({ success: false, error: Errors.NotAdmin });
    }

    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('staff-picks')
      .upsert({ id, picker_id, type, score })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    await request.env.STAFFPICKS.delete(STAFFPICKS_KV_KEY);

    return response({ success: true, result: data });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
