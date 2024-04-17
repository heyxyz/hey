const getNftChainId = (id: string): string => {
  switch (id) {
    case '1':
      return 'ethereum';
    case '5':
      return 'goerli';
    case '10':
      return 'optimism';
    case '69':
      return 'optimism-testnet';
    case '7777777':
      return 'zora';
    case '999999999':
      return 'zora-testnet';
    case '8453':
      return 'base';
    case '84531':
      return 'base-testnet';
    case '137':
      return 'polygon';
    case '80002':
      return 'amoy';
    default:
      return 'ethereum';
  }
};

export default getNftChainId;
