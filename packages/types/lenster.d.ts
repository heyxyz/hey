import type { Database } from '@lenster/supabase/database.types';

export type Channel = Database['public']['Tables']['channels']['Row'] & {
  members: number;
};
