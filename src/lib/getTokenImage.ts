import { STATIC_ASSETS } from 'src/constants'

const getTokenImage = (symbol: string) =>
  `${STATIC_ASSETS}/tokens/${symbol?.toLowerCase()}.svg`

export default getTokenImage
