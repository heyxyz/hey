import { chain } from 'wagmi'

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'

export const APP_NAME = 'Lenster'
export const DESCRIPTION =
  'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿'
export const DEFAULT_OG = 'https://assets.lenster.xyz/images/og/logo.jpeg'

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
export const GIT_COMMIT_REF = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF

// Misc
export const CONTACT_EMAIL = 'support@lenster.xyz'
export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL
export const RELAY_ON =
  PUBLIC_URL === 'https://lenster.xyz' || PUBLIC_URL === 'http://localhost:4783'
    ? process.env.NEXT_PUBLIC_RELAY_ON === 'true'
    : false

// Messages
export const ERROR_MESSAGE = 'Something went wrong!'
export const CONNECT_WALLET = 'Please connect your wallet.'
export const SIGN_WALLET = 'Please sign in your wallet.'
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.'
export const SIGN_ERROR = 'Failed to sign data'

// URLs
export const STATIC_ASSETS = 'https://assets.lenster.xyz/images'
export const API_URL = IS_MAINNET
  ? 'https://api.lens.dev'
  : 'https://api-mumbai.lens.dev'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const RARIBLE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://rinkeby.rarible.com'
export const IMAGEKIT_URL_PROD = 'https://ik.imagekit.io/lensterimg'
export const IMAGEKIT_URL_DEV = 'https://ik.imagekit.io/lensterdev'
export const IMAGEKIT_URL = IS_PRODUCTION ? IMAGEKIT_URL_PROD : IMAGEKIT_URL_DEV

// Web3
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY
export const ALCHEMY_RPC = IS_MAINNET
  ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`

export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
}
export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
}
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id

export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
}

// Addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const LENSHUB_PROXY = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
export const LENS_PERIPHERY = IS_MAINNET
  ? '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f'
  : '0xD5037d72877808cdE7F669563e9389930AF404E8'
export const REVERT_COLLECT_MODULE = IS_MAINNET
  ? '0xa31FF85E840ED117E172BC9Ad89E55128A999205'
  : '0x5E70fFD2C6D04d65C3abeBa64E93082cfA348dF8'
export const DEFAULT_COLLECT_TOKEN = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
