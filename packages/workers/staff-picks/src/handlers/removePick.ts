import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { object, string } from 'zod';

import { STAFFPICKS_KV_KEY } from '../constants';
import checkIsStaffFromDb from '../helpers/checkIsStaffFromDb';
import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
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

  const { id } = body as ExtensionRequest;

  try {
    const { payload } = jwt.decode(accessToken as string);

    const isStaffOnDb = await checkIsStaffFromDb(request, payload.id);
    if (!isStaffOnDb) {
      return response({ success: false, error: Errors.NotAdmin });
    }

    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { error } = await client.from('staff-picks').delete().eq('id', id);

    if (error) {
      throw error;
    }

    await request.env.STAFFPICKS.delete(STAFFPICKS_KV_KEY);

    return response({ success: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
