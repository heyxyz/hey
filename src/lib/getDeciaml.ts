const getDecimal = (symbol: string): number => {
  switch (symbol) {
    case 'USDC':
    case 'USDT':
      return 6
    default:
      return 18
  }
}

export default getDecimal
