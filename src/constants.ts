import getEnvConfig from '@lib/getEnvConfig';
import { chain } from 'wagmi';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';
export const MAINNET_API_URL = 'https://api.lens.dev';
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev';
export const SANDBOX_API_URL = 'https://api-sandbox-mumbai.lens.dev';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const MAINNET_LENSHUB_PROXY = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d';
export const MAINNET_LENS_PERIPHERY = '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f';
export const MAINNET_FREE_COLLECT_MODULE = '0x23b9467334bEb345aAa6fd1545538F3d54436e96';
export const MAINNET_DEFAULT_TOKEN = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
export const TESTNET_LENSHUB_PROXY = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82';
export const TESTNET_LENS_PERIPHERY = '0xD5037d72877808cdE7F669563e9389930AF404E8';
export const TESTNET_FREE_COLLECT_MODULE = '0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c';
export const TESTNET_DEFAULT_TOKEN = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
export const SANDBOX_LENSHUB_PROXY = '0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5';
export const SANDBOX_LENS_PERIPHERY = '0x5dDD1d6c04E805D830574A31Bf7979D416c6d7c5';
export const SANDBOX_FREE_COLLECT_MODULE = '0xD57C675b542bFC24242a1088514306fFaeaFc6Fb';

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const FREE_COLLECT_MODULE = getEnvConfig().freeCollectModuleAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;

export const IS_MAINNET = API_URL === MAINNET_API_URL;

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
export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';
export const MIXPANEL_API_HOST = 'https://utils.lenster.xyz/collect';

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
export const ARWEAVE_GATEWAY = 'https://arweave.net';
export const IMAGEKIT_URL = `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}`;
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

// UI
export const PAGINATION_ROOT_MARGIN = '1000% 0px';
