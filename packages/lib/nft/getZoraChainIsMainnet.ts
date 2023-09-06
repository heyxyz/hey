const mainnetChains = ['eth', 'oeth', 'base', 'zora'];

/**
 * Returns true if the chain is mainnet
 * @param chain The chain to check
 * @returns True if the chain is mainnet
 */
const getZoraChainIsMainnet = (chain: string): boolean => {
  return mainnetChains.includes(chain);
};

export default getZoraChainIsMainnet;
