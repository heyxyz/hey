import type { Database } from '@hey/supabase/database.types';

export type Group = Database['public']['Tables']['groups']['Row'] & {
  members: number;
};

export type StaffPick = Database['public']['Tables']['staff-picks']['Row'];

export type MembershipNft =
  Database['public']['Tables']['membership-nft']['Row'];
