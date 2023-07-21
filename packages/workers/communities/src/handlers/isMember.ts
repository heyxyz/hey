import { createClient } from '@supabase/supabase-js';
import { error } from 'itty-router';

import { MEMBERSHIPS_TABLE } from '../constants';
import type { Env } from '../types';

export default async (communityId: string, profileId: string, env: Env) => {
  if (!communityId || !profileId) {
    return error(400, 'Bad request!');
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const { count, error } = await supabase
      .from(MEMBERSHIPS_TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)
      .eq('profile_id', profileId);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        isMember: (count ?? 0) > 0
      })
    );
  } catch (error) {
    console.error('Failed to create metadata data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
