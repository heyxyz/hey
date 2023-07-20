import { createClient } from '@supabase/supabase-js';
import { error } from 'itty-router';

import { COMMUNITIES_TABLE, MEMBERSHIPS_TABLE } from '../constants';
import type { Env } from '../types';

export default async (slug: string, offset: string, env: Env) => {
  if (!slug) {
    return error(400, 'Bad request!');
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const { data: community, error: communityError } = await supabase
      .from(COMMUNITIES_TABLE)
      .select('id')
      .eq('slug', slug)
      .single();

    const { data: memberships, error: membershipsError } = await supabase
      .from(MEMBERSHIPS_TABLE)
      .select('id, profile_id')
      .eq('community_id', community?.id)
      .range(parseInt(offset), parseInt(offset) + 10);

    if (communityError || membershipsError) {
      throw error;
    }

    return new Response(JSON.stringify(memberships));
  } catch (error) {
    console.error('Failed to create metadata data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
