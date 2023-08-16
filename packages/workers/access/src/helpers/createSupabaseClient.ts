import { SUPABASE_URL } from '@lenster/data/constants';
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../database.types';
import type { Env } from '../types';

const createSupabaseClient = (env: Env) => {
  return createClient<Database>(SUPABASE_URL, env.SUPABASE_KEY);
};

export default createSupabaseClient;
