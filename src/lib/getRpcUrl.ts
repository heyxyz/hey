const getRpcUrl = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'https://eth-mainnet.g.alchemy.com/v2/PuowllW0wEXLxeuzFnxwiIJ8q7k7RJAv'
    case 137:
      return 'https://polygon-mainnet.g.alchemy.com/v2/HHfOFn8jsYguteTVvL0cz4g9aydrbjTV'
    case 80001:
      return 'https://polygon-mumbai.g.alchemy.com/v2/vvYntWnPbNhSitUmgEZRXQBxwzPpFBvo'
    default:
      return 'https://polygon-mumbai.g.alchemy.com/v2/vvYntWnPbNhSitUmgEZRXQBxwzPpFBvo'
  }
}

export default getRpcUrl
