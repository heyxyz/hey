export interface NftProviderWithMintLink {
  mintLink: string;
  provider: 'basepaint' | 'unlonely-channel' | 'unlonely-nfc' | 'zora';
}

export interface BasicNftMetadata extends NftProviderWithMintLink {
  address: string;
  chain: string;
  token: string;
}

export interface BasePaintCanvasMetadata extends NftProviderWithMintLink {
  id: number;
}

export interface UnlonelyChannelMetadata extends NftProviderWithMintLink {
  slug: string;
}

export interface UnlonelyNfcMetadata extends NftProviderWithMintLink {
  id: string;
}

export type NftMetadata =
  | BasePaintCanvasMetadata
  | BasicNftMetadata
  | UnlonelyChannelMetadata
  | UnlonelyNfcMetadata;

export interface ZoraNft {
  address: `0x${string}`;
  chainId: number;
  contractStandard: 'ERC1155' | 'ERC721';
  contractType:
    | 'ERC1155_COLLECTION_TOKEN'
    | 'ERC1155_COLLECTION'
    | 'ERC721_DROP'
    | 'ERC721_SINGLE_EDITION';
  coverImageUrl: string;
  creator: `0x${string}`;
  description: string;
  entityType: 'CONTRACT' | 'TOKEN';
  isOpenEdition: boolean;
  maxSupply: number;
  mediaUrl: string;
  name: string;
  owner: `0x${string}`;
  price: string;
  remainingSupply: number;
  tokenId: string;
  totalMinted: number;
}

export interface BasePaintCanvas {
  bitmap: {
    gif: string;
  };
  canContribute: boolean;
  canMint: boolean;
  contributions: {
    account: {
      id: string;
      screenName: string;
      totalPixels: number;
    };
  }[];
  id: number;
  palette: string[];
  pixelsCount: number;
  theme: string;
  totalEarned: string;
  totalMints: number;
}

export interface UnlonelyChannel {
  description: string;
  id: number;
  isLive: boolean;
  name: string;
  playbackUrl: string;
  slug: string;
}

export interface UnlonelyNfc {
  createdAt: string;
  id: number;
  openseaLink: string;
  owner: {
    FCImageUrl: string;
    lensImageUrl: string;
    username: string;
  };
  title: string;
  videoLink: string;
  videoThumbnail: string;
}
