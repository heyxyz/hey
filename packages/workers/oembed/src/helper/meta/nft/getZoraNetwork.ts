import type { NetworkInput } from '@lenster/zora';
import { Chain, Network } from '@lenster/zora';

export const ETHEREUM = { network: Network.Ethereum, chain: Chain.Mainnet };
export const BASE = { network: Network.Base, chain: Chain.BaseMainnet };
export const ZORA = { network: Network.Zora, chain: Chain.ZoraMainnet };
export const OPTIMISM = {
  network: Network.Optimism,
  chain: Chain.OptimismMainnet
};

const getZoraNetwork = (chain: string): NetworkInput => {
  switch (chain) {
    case 'eth':
      return ETHEREUM;
    case 'base':
      return BASE;
    case 'zora':
      return ZORA;
    case 'optimism':
      return OPTIMISM;
    default:
      return ETHEREUM;
  }
};

export default getZoraNetwork;
