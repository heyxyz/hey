export interface LensterAttachment {
  item: string;
  type: string;
  altTag: string;
}

export interface NewLensterAttachment extends Omit<LensterAttachment, 'item'> {
  id: string;
  item?: string;
  previewItem?: string;
}

export interface UserSuggestion {
  uid: string;
  id: string;
  display: string;
  name: string;
  picture: string;
}

export interface OG {
  title: string;
  description: string;
  site: string;
  url: string;
  favicon: string;
  thumbnail: string;
  isSquare: boolean;
  html: string;
}

export interface ProfileInterest {
  category: { label: string; id: string };
  subCategories: { label: string; id: string }[];
}

export interface Emoji {
  emoji: string;
  description: string;
  category: string;
  aliases: string[];
  tags: string[];
}

export interface MessageDescriptor {
  id?: string;
  comment?: string;
  message?: string;
  context?: string;
  values?: Record<string, unknown>;
}

export interface OptimisticTransaction {
  txHash?: string;
  txId?: string;
  title?: string;
  cover?: string;
  author?: string;
  content: string;
  attachments: LensterAttachment[];
}

export interface MarkupLinkProps {
  href?: string;
  title?: string;
}

export interface Attribute {
  trait_type: string;
  value: number | string;
}

export interface CollectionInfo {
  symbol: string;
  name: string;
  original_name: string;
  listed_count: number;
  owner_count: number;
  token_count: number;
}

export interface LineaContract {
  contract_address: string;
  chain_id: number;
  is_erc1155: boolean;
  is_erc721: boolean;
  owner: string;
  collection_info: CollectionInfo;
  sale_volume: number;
  verified: boolean;
  is_rarity_enabled: boolean;
}

export interface Contracts {
  59140: LineaContract[];
}

export interface CollectionInfo {
  symbol: string;
  name: string;
  original_name: string;
  listed_count: number;
  owner_count: number;
  token_count: number;
}

export interface Metadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Attribute[];
}

export interface TokenInfo {
  metadata?: Metadata;
}

export interface LineaToken {
  contract_address: string;
  token_id: string;
  owner: string;
  token_info: TokenInfo;
  chain_id: number;
}

export interface Tokens {
  59140: LineaToken[];
}

export interface TokenInfo {
  metadata?: Metadata;
}

export interface Metadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Attribute[];
}

export interface OriginalContent {
  uri?: string;
}

export interface NftLinea {
  contractAddress?: string;
  collectionName?: string;
  contractName?: string;
  chainId?: number;
  tokenId?: number;
  name?: string;
  description?: string;
  originalContent?: OriginalContent;
}

export interface RawNfts {
  success: boolean;
  address: string;
  sort_by: string;
  contract_addresses: string;
  contracts: Contracts;
  tokens: Tokens;
}
