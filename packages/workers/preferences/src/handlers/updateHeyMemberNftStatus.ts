import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';
import validateLensAccount from '@hey/lib/validateLensAccount';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  id: string;
  dismissedOrMinted: boolean;
};

const validationSchema = object({
  id: string(),
  dismissedOrMinted: boolean()
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

  const { id, dismissedOrMinted } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return response({ success: false, error: Errors.InvalidAccesstoken });
    }

    const { payload } = jwt.decode(accessToken);
    if (payload.id !== id) {
      return response({ success: false, error: Errors.InvalidAddress });
    }

    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data, error } = await client
      .from('membership-nft')
      .upsert({ id, dismissedOrMinted })
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
