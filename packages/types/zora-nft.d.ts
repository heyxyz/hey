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
  owner: string;
  maxSupply: string;
  totalMinted: string;
  totalSupply: string;
}
