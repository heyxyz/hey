export interface NftProvider {
  provider: 'zora' | 'basepaint';
}

export interface BasicNftMetadata extends NftProvider {
  chain: string;
  address: string;
  token: string;
}

export interface BasePaintCanvasMetadata extends NftProvider {
  id: number;
}

export type NftMetadata = BasicNftMetadata | BasePaintCanvasMetadata;

export interface ZoraNft {
  chainId: number;
  name: string;
  description: string;
  coverImageUrl: string;
  mediaUrl: string;
  tokenId: string;
  address: `0x${string}`;
  owner: `0x${string}`;
  creator: `0x${string}`;
  maxSupply: number;
  remainingSupply: number;
  totalMinted: number;
  isOpenEdition: boolean;
  price: string;
  contractType:
    | 'ERC721_DROP'
    | 'ERC721_SINGLE_EDITION'
    | 'ERC1155_COLLECTION'
    | 'ERC1155_COLLECTION_TOKEN';
  contractStandard: 'ERC721' | 'ERC1155';
}

export interface BasePaintCanvas {
  id: number;
  canContribute: boolean;
  canMint: boolean;
  palette: string[];
  theme: string;
  totalEarned: string;
  totalMints: number;
  pixelsCount: number;
  bitmap: {
    gif: string;
  };
  contributions: {
    account: {
      id: string;
      screenName: string;
      totalPixels: number;
    };
  }[];
}
