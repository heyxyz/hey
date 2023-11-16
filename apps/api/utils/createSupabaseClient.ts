import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL } from './constants';
import type { Database } from './database.types';

const createSupabaseClient = () => {
  return createClient<Database>(
    SUPABASE_URL,
    process.env.SUPABASE_KEY as string
  );
};

export default createSupabaseClient;
