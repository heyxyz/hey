import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL } from './constants';
// @ts-ignore
import type { Database } from './database.types';

const createSupabaseClient = (key: string) => {
  return createClient<Database>(SUPABASE_URL, key);
};

export default createSupabaseClient;
