import { STATIC_ASSETS } from 'src/constants'

export const getTokenImage = (symbol: string) =>
  `${STATIC_ASSETS}/tokens/${symbol?.toLowerCase()}.svg`
