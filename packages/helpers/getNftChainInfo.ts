import { STATIC_IMAGES_URL } from "@hey/data/constants";

const getNftChainInfo = (
  chain: string
): {
  logo: string;
  name: string;
} => {
  switch (chain) {
    case "ethereum":
    case "goerli":
      return {
        logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
        name: chain === "ethereum" ? "Ethereum" : "Goerli"
      };
    case "optimism":
    case "optimism-testnet":
      return {
        logo: `${STATIC_IMAGES_URL}/chains/optimism.svg`,
        name: chain === "optimism" ? "Optimism" : "Optimism Testnet"
      };
    case "zora":
    case "zora-testnet":
      return {
        logo: `${STATIC_IMAGES_URL}/chains/zora.svg`,
        name: chain === "zora" ? "Zora" : "Zora Testnet"
      };
    case "base":
    case "base-testnet":
      return {
        logo: `${STATIC_IMAGES_URL}/chains/base.svg`,
        name: chain === "base" ? "Base" : "Base Testnet"
      };
    case "polygon":
    case "amoy":
      return {
        logo: `${STATIC_IMAGES_URL}/chains/polygon.svg`,
        name: chain === "polygon" ? "Polygon" : "Polygon Amoy"
      };
    default:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
        name: "Ethereum"
      };
  }
};

export default getNftChainInfo;
