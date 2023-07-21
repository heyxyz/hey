import { createClient } from '@supabase/supabase-js';
import { error } from 'itty-router';

import { MEMBERSHIPS_TABLE } from '../constants';
import type { Env } from '../types';

export default async (communityId: string, offset: string, env: Env) => {
  if (!communityId) {
    return error(400, 'Bad request!');
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const { data, error } = await supabase
      .from(MEMBERSHIPS_TABLE)
      .select('id, profile_id')
      .eq('community_id', communityId)
      .range(parseInt(offset), parseInt(offset) + 10);

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
