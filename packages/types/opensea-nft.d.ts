export interface OpenSeaNft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  metadata_url: string;
  created_at: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  is_suspicious: boolean;
  creator: string;
  traits: {
    trait_type: string;
    display_type: string;
    max_value: string;
    trait_count: number;
    order: string;
    value: string;
  }[];
  owners: {
    address: string;
    quantity: number;
  }[];
  rarity: null;
}

export interface OpenSeaCollection {
  name: string;
  safelist_request_status: 'verified';
  twitter_username?: string;
}
