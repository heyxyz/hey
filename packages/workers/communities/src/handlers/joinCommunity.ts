import validateLensAccount from '@lenster/lib/validateLensAccount';
import { createClient } from '@supabase/supabase-js';
import { error, type IRequest } from 'itty-router';
import { object, string } from 'zod';

import { MEMBERSHIPS_TABLE } from '../constants';
import type { Env } from '../types';

type ExtensionRequest = {
  communityId: string;
  profileId: string;
  accessToken: string;
};

const validationSchema = object({
  communityId: string().uuid(),
  profileId: string(),
  accessToken: string().regex(/^([\w=]+)\.([\w=]+)\.([\w+/=\-]*)/)
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return new Response(
      JSON.stringify({ success: false, error: validation.error.issues })
    );
  }

  const { communityId, profileId, accessToken } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, true);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid access token!' })
      );
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const { data: existing } = await supabase
      .from(MEMBERSHIPS_TABLE)
      .select()
      .eq('community_id', communityId)
      .eq('profile_id', profileId);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Already a member!' })
      );
    }

    const { data, error } = await supabase
      .from(MEMBERSHIPS_TABLE)
      .upsert({ community_id: communityId, profile_id: profileId })
      .select();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error('Failed to create metadata data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
