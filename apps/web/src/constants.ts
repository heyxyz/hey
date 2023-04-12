import type { Chain } from 'wagmi';

// Web3
export const linea = {
  id: 59_140,
  name: 'Linea',
  network: 'linea',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: { http: ['https://rpc.goerli.linea.build'] },
    default: { http: ['https://rpc.goerli.linea.build'] }
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://explorer.goerli.linea.build/' }
  }
} as const satisfies Chain;

export const CHAIN_ID = linea.id;
