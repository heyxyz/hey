export const getTokenName = (address: string, chain: any) => {
  let name;
  if (!address) {
    return '';
  }
  if (chain) {
    switch (chain.id) {
      case 80001:
        if (address.toLowerCase() == '0x9c3c9283d3e44854697cd22d3faa240cfb032889') {
          name = 'WMATIC';
        }
        break;
      case 137:
        if (address.toLowerCase() == '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270') {
          name = 'WMATIC';
        }
        break;
      default:
        name = 'View on block explorer';
        break;
    }
    return name;
  }
};
