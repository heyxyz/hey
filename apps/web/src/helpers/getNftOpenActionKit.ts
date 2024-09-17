import { NftOpenActionKit } from "nft-openaction-kit";

const getNftOpenActionKit = () => {
  return new NftOpenActionKit({
    decentApiKey: process.env.NEXT_PUBLIC_DECENT_API_KEY || ""
  });
};

export default getNftOpenActionKit;
