import { STATIC_IMAGES_URL } from '@hey/data/constants';

const getZoraChainInfo = (
  chain: number
): {
  logo: string;
  name: string;
} => {
  switch (chain) {
    case 1:
    case 5:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
        name: chain === 1 ? 'Ethereum' : 'Goerli'
      };
    case 10:
    case 420:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/optimism.svg`,
        name: chain === 10 ? 'Optimism' : 'Optimism Testnet'
      };
    case 7777777:
    case 999:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/zora.svg`,
        name: chain === 7777777 ? 'Zora' : 'Zora Testnet'
      };
    case 8453:
    case 84531:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/base.svg`,
        name: chain === 8453 ? 'Base' : 'Base Testnet'
      };
    case 424:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/pgn.svg`,
        name: 'PGN Network'
      };
    default:
      return {
        logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
        name: 'Ethereum'
      };
  }
};

export default getZoraChainInfo;
