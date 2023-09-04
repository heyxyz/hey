const getZoraChainInfo = (
  chain: number
): {
  name: string;
  logo: string;
} => {
  switch (chain) {
    case 1:
    case 5:
      return {
        name: chain === 1 ? 'Ethereum' : 'Goerli',
        logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
      };
    case 10:
    case 420:
      return {
        name: chain === 10 ? 'Optimism' : 'Optimism Testnet',
        logo: 'https://zora.co/assets/icon/optimism-ethereum-op-logo.svg'
      };
    case 7777777:
    case 999:
      return {
        name: chain === 7777777 ? 'Zora' : 'Zora Testnet',
        logo: 'https://zora.co/assets/icon/zora-logo.svg'
      };
    case 8453:
    case 84531:
      return {
        name: chain === 8453 ? 'Base' : 'Base Testnet',
        logo: 'https://zora.co/assets/icon/base-logo.svg'
      };
    case 424:
      return {
        name: 'PGN Network',
        logo: 'https://zora.co/assets/icon/pgn-logo.svg'
      };
    default:
      return {
        name: 'Ethereum',
        logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
      };
  }
};

export default getZoraChainInfo;
