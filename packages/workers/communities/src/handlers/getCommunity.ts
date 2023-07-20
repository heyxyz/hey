import { createClient } from '@supabase/supabase-js';
import { error } from 'itty-router';

import { COMMUNITIES_TABLE } from '../constants';
import type { Env } from '../types';

export default async (slug: string, env: Env) => {
  if (!slug) {
    return error(400, 'Bad request!');
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const { data, error } = await supabase
      .from(COMMUNITIES_TABLE)
      .select('*')
      .eq('slug', slug)
      .single();

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
