import { chain } from 'wagmi'

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
export const GIT_COMMIT_REF = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF

// Misc
export const CONTACT_EMAIL = 'support@lenster.xyz'

// Messages
export const ERROR_MESSAGE = 'Something went wrong!'
export const CONNECT_WALLET = 'Please connect your wallet.'
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.'
export const SIGN_ERROR = 'Failed to sign data'

// URLs
export const STATIC_ASSETS = 'https://assets.lenster.xyz/images'
export const API_URL = IS_MAINNET
  ? 'https://api-mumbai.lens.dev'
  : 'https://api-mumbai.lens.dev'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const OPENSEA_URL = IS_MAINNET
  ? 'https://opensea.io'
  : 'https://testnets.opensea.io'
export const IMAGEKIT_URL_PROD = 'https://ik.imagekit.io/lensterimg'
export const IMAGEKIT_URL_DEV = 'https://ik.imagekit.io/lensterdev'
export const IMAGEKIT_URL = IS_PRODUCTION ? IMAGEKIT_URL_PROD : IMAGEKIT_URL_DEV

// Web3
export const INFURA_ID = '1423f014ff0243e3b7ab20fbb3f8656f'
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

// Addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const LENSHUB_PROXY = IS_MAINNET
  ? '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
export const LENS_PERIPHERY = IS_MAINNET
  ? '0xD5037d72877808cdE7F669563e9389930AF404E8'
  : '0xD5037d72877808cdE7F669563e9389930AF404E8'
export const FREE_COLLECT_MODULE = IS_MAINNET
  ? '0x5E70fFD2C6D04d65C3abeBa64E93082cfA348dF8'
  : '0x5E70fFD2C6D04d65C3abeBa64E93082cfA348dF8'
export const DEFAULT_COLLECT_TOKEN = IS_MAINNET
  ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
