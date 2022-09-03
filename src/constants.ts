import { chain } from 'wagmi';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Blockchain Network
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.lens.dev';
export const IS_MAINNET = API_URL === 'https://api.lens.dev';

// Application
export const APP_NAME = 'Lenster';
export const DESCRIPTION =
  'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿';
export const DEFAULT_OG = 'https://assets.lenster.xyz/images/og/logo.jpeg';

// Git
export const GIT_COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

// Misc
export const CONTACT_EMAIL = 'support@lenster.xyz';
export const RELAY_ON = process.env.NEXT_PUBLIC_RELAY_ON === 'true';
export const POSTHOG_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_TOKEN ?? '';
export const HOG_ENDPOINT = 'https://hog.lenster.xyz';

// Messages
export const ERROR_MESSAGE = 'Something went wrong!';
export const SIGN_WALLET = 'Please sign in your wallet.';
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.';
export const SIGN_ERROR = 'Failed to sign data';

// URLs
export const STATIC_ASSETS = 'https://assets.lenster.xyz/images';
export const POLYGONSCAN_URL = IS_MAINNET ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com';
export const RARIBLE_URL = IS_MAINNET ? 'https://rarible.com' : 'https://rinkeby.rarible.com';
export const IMAGEKIT_URL_PROD = 'https://ik.imagekit.io/lensterimg';
export const IMAGEKIT_URL_DEV = 'https://ik.imagekit.io/lensterdev';
export const ARWEAVE_GATEWAY = 'https://arweave.net';
export const IMAGEKIT_URL = IS_PRODUCTION ? IMAGEKIT_URL_PROD : IMAGEKIT_URL_DEV;
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/';

// Web3
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
export const ALCHEMY_RPC = IS_MAINNET
  ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
  : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`;

export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
};
export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
};
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id;

// Errors
export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
};

// Addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LENSHUB_PROXY = process.env.NEXT_PUBLIC_LENSHUB_PROXY ?? '';
export const LENS_PERIPHERY = process.env.NEXT_PUBLIC_LENS_PERIPHERY ?? '';
export const FREE_COLLECT_MODULE = process.env.NEXT_PUBLIC_FREE_COLLECT_MODULE ?? '';
export const DEFAULT_COLLECT_TOKEN = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';

// Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/;
export const ADDRESS_REGEX = /^(0x)?[\da-f]{40}$/i;
export const HANDLE_REGEX = /^[\da-z]+$/;
export const ALL_HANDLES_REGEX = /([\s+])@(\S+)/g;
export const HANDLE_SANITIZE_REGEX = /[^\d .A-Za-z]/g;

// Utils
export const ALLOWED_MEDIA_TYPES = ['video/mp4', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Bundlr
export const BUNDLR_CURRENCY = 'matic';
export const BUNDLR_NODE_URL = 'https://node2.bundlr.network';
