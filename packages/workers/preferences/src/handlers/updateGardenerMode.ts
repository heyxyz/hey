import '@sentry/tracing';

import { Errors } from '@lenster/data/errors';
import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import response from '@lenster/lib/response';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { boolean, object, string } from 'zod';

import createSupabaseClient from '../helpers/createSupabaseClient';
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
  const transaction = request.sentry?.startTransaction({
    name: '@lenster/preferences/updateGardenerMode'
  });

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
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidProfileId })
      );
    }

    const client = createSupabaseClient(request.env);

    const { data, error } = await client
      .from('rights')
      .update({ gardener_mode: enabled })
      .eq('is_gardener', true)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return response({ success: true, result: data });
  } catch (error) {
    request.sentry?.captureException(error);
    throw error;
  } finally {
    transaction?.finish();
  }
};
