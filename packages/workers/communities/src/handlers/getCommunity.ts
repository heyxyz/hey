import { createClient } from '@supabase/supabase-js';
import { error } from 'itty-router';

import { COMMUNITIES_TABLE, MEMBERSHIPS_TABLE } from '../constants';
import type { Env } from '../types';

export default async (slug: string, env: Env) => {
  if (!slug) {
    return error(400, 'Bad request!');
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const { data: community, error: communityError } = await supabase
      .from(COMMUNITIES_TABLE)
      .select('*')
      .eq('slug', slug)
      .single();

    const { count, error: membershipsError } = await supabase
      .from(MEMBERSHIPS_TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('community_id', community.id);

    if (communityError || membershipsError) {
      throw error;
    }

    const mergedData = {
      ...community,
      members_count: count
    };

    return new Response(JSON.stringify(mergedData));
  } catch (error) {
    console.error('Failed to create metadata data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
