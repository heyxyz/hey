export interface ZoraNftMetadata {
  chain: string;
  address: string;
  token: string;
}

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
    | 'ERC1155_COLLECTION'
    | 'ERC1155_COLLECTION_TOKEN';
  contractStandard: 'ERC721' | 'ERC1155';
}
