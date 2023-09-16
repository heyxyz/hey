import { Errors } from '@lenster/data/errors';
import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import response from '@lenster/lib/response';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import createSupabaseClient from '@lenster/supabase/createSupabaseClient';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  profileId: string;
  channelId: string;
};

const validationSchema = object({
  profileId: string(),
  channelId: string()
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

  const { profileId, channelId } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return response({ success: false, error: Errors.InvalidAccesstoken });
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(payload.id, profileId, true);
    if (!hasOwned) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidProfileId })
      );
    }

    const client = createSupabaseClient(request.env.SUPABASE_KEY);

    const { data: membershipData, error: membershipError } = await client
      .from('channel_memberships')
      .select()
      .eq('profile_id', profileId)
      .eq('channel_id', channelId);

    if (membershipError) {
      throw membershipError;
    }

    if (membershipData?.length) {
      // Leave
      const { error: deleteError } = await client
        .from('channel_memberships')
        .delete()
        .eq('profile_id', profileId)
        .eq('channel_id', channelId);

      if (deleteError) {
        throw deleteError;
      }

      return response({ success: true });
    }

    // Join
    const { error: insertError } = await client
      .from('channel_memberships')
      .insert({ profile_id: profileId, channel_id: channelId });

    if (insertError) {
      throw insertError;
    }

    return response({ success: true });
  } catch (error) {
    throw error;
  }
};
