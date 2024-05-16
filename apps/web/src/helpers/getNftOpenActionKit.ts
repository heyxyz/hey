import { NftOpenActionKit } from 'nft-openaction-kit';

const getNftOpenActionKit = () => {
  return new NftOpenActionKit({
    decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || '',
    openSeaApiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
    raribleApiKey: process.env.NEXT_PUBLIC_RARIBLE_API_KEY || ''
  });
};

export default getNftOpenActionKit;
