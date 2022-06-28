const getAnkrURL = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return `https://rpc.ankr.com/eth`
    case 137:
      return `https://rpc.ankr.com/polygon`
    case 80001:
      return `https://rpc.ankr.com/polygon_mumbai`
    default:
      return `https://rpc.ankr.com/polygon_mumbai`
  }
}

export default getAnkrURL
