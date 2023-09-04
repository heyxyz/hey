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
  address: `0x${string}`;
  owner: `0x${string}`;
  maxSupply: string;
  totalMinted: string;
  totalSupply: string;
  contractStandard: string;
}
