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
export const IMAGEKIT_URL = IS_PRODUCTION
  ? 'https://ik.imagekit.io/lensterimg'
  : 'https://ik.imagekit.io/lensterdev'

// Web3
export const INFURA_ID = '1423f014ff0243e3b7ab20fbb3f8656f'
export const POLYGON_MAINNET = {
  ...chain.polygonMainnet,
  name: 'Polygon Mainnet',
  rpcUrls: ['https://polygon-rpc.com']
}

export const POLYGON_MUMBAI = {
  ...chain.polygonTestnetMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: ['https://rpc-mumbai.maticvigil.com']
}
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id

// Addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const LENSHUB_PROXY = IS_MAINNET
  ? '0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0'
  : '0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0'
export const REVERT_COLLECT_MODULE = IS_MAINNET
  ? '0x6027B03c00aCC750D55FFC6b6381bB748A9C8590'
  : '0x6027B03c00aCC750D55FFC6b6381bB748A9C8590'
export const DEFAULT_COLLECT_TOKEN = IS_MAINNET
  ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'

export const STATUS_PAGE_URL = 'https://status.lenster.xyz'
export const GITLAB_URL = 'https://gitlab.com/lenster/lenster'
export const VERCEL_REF_URL =
  'https://vercel.com/?utm_source=Lenster&utm_campaign=oss'
export const OPEN_ANAYTICS_PAGE_URL =
  'https://analytics.lenster.xyz/share/DUGyxaF6/Lenster'
