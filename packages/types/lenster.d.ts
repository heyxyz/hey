import type { Database } from '@hey/supabase/database.types';

export type Channel = Database['public']['Tables']['channels']['Row'] & {
  members: number;
};
