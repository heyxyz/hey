export const getTokenImage = (symbol: string) => {
  switch (symbol) {
    // Collect Modules
    case 'WMATIC':
      return 'https://assets.lenster.xyz/images/tokens/wmatic.webp'
    case 'WETH':
      return 'https://assets.lenster.xyz/images/tokens/weth.webp'
    case 'USDC':
      return 'https://assets.lenster.xyz/images/tokens/usdc.webp'
    case 'DAI':
      return 'https://assets.lenster.xyz/images/tokens/dai.webp'
    default:
      return 'https://assets.lenster.xyz/images/tokens/wmatic.webp'
  }
}
