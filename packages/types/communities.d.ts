export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  members_count?: number;
  twitter?: string;
  website?: string;
  nsfw?: boolean;
  profile?: string;
  created_at: string;
}
