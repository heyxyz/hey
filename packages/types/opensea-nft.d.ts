export interface OpenSeaNft {
  collection: string;
  contract: string;
  created_at: string;
  creator: string;
  description: string;
  identifier: string;
  image_url: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  is_suspicious: boolean;
  metadata_url: string;
  name: string;
  owners: {
    address: string;
    quantity: number;
  }[];
  rarity: null;
  token_standard: string;
  traits: {
    display_type: string;
    max_value: string;
    order: string;
    trait_count: number;
    trait_type: string;
    value: string;
  }[];
  updated_at: string;
}

export interface OpenSeaCollection {
  name: string;
  safelist_request_status: 'verified';
  twitter_username?: string;
}
