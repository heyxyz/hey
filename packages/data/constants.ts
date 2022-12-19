import packageJson from '../../package.json';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';
export const MAINNET_API_URL = 'https://api.lens.dev';
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev';
export const SANDBOX_API_URL = 'https://api-sandbox-mumbai.lens.dev';
export const STAGING_API_URL = 'https://staging-api-social-mumbai.lens.crtlkey.com';
export const STAGING_SANDBOX_API_URL = 'https://staging-api-social-mumbai.sandbox.crtlkey.com';

export const SERVERLESS_MAINNET_API_URL = 'https://api.lenster.xyz';
export const SERVERLESS_TESTNET_API_URL = 'https://api-testnet.lenster.xyz';
export const SERVERLESS_STAGING_API_URL = 'https://api-staging.lenster.xyz';
export const SERVERLESS_STAGING_SANDBOX_API_URL = 'https://api-staging-sandbox.lenster.xyz';
export const SERVERLESS_SANDBOX_API_URL = 'https://api-sandbox.lenster.xyz';
export const SERVERLESS_DEVELOPMENT_API_URL = 'http://localhost:4784';

export const SERVERLESS_URL = getEnvConfig().serverlessEndpoint;
export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const LIT_PROTOCOL_ENVIRONMENT = getEnvConfig().litProtocolEnvironment;

export const IS_MAINNET = API_URL === MAINNET_API_URL;

// XMTP
export const XMTP_ENV = IS_MAINNET ? 'production' : 'dev';
export const XMTP_PREFIX = 'lens.dev/dm';

// Application
export const APP_NAME = 'Lenster';
export const DESCRIPTION =
  'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿';
export const DEFAULT_OG = 'https://assets.lenster.xyz/images/og/logo.jpeg';
export const APP_VERSION = packageJson.version;

// Git
export const GIT_COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

// Misc
export const CONTACT_EMAIL = 'support@lenster.freshdesk.com';
export const RELAY_ON = true;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LENSPROTOCOL_HANDLE = 'lensprotocol';
export const HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test';

// Messages
export const ERROR_MESSAGE = 'Something went wrong!';
export const SIGN_WALLET = 'Please sign in your wallet.';
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.';
export const SIGN_ERROR = 'Failed to sign data';

// URLs
export const STATIC_ASSETS_URL = 'https://assets.lenster.xyz';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const POLYGONSCAN_URL = IS_MAINNET ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com';
export const RARIBLE_URL = IS_MAINNET ? 'https://rarible.com' : 'https://rinkeby.rarible.com';
export const MEDIA_PROXY_URL = 'https://media.lenster.xyz';
export const OG_MEDIA_PROXY_URL = 'https://og-media.lenster.xyz';
export const ARWEAVE_GATEWAY = 'https://arweave.net';
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/';
export const EVER_API = 'https://endpoint.4everland.co';
export const SIMPLEANALYTICS_API = 'https://simpleanalytics.com/lenster.xyz.json';

// Web3
export const RPC_URL = IS_MAINNET ? 'https://rpc.ankr.com/polygon' : 'https://rpc.ankr.com/polygon_mumbai';

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
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
  'audio/webm',
  'audio/flac'
];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime'];
export const ALLOWED_MEDIA_TYPES = [...ALLOWED_VIDEO_TYPES, ...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES];

// UI
export const MESSAGE_PAGE_LIMIT = 15;
export const SCROLL_THRESHOLD = 0.5;
export const MIN_WIDTH_DESKTOP = 1024;

// Named transforms
export const AVATAR = 'avatar';
export const COVER = 'cover';
export const ATTACHMENT = 'attachment';

// Localstorage keys
export const LS_KEYS = {
  LENSTER_STORE: 'lenster.store',
  TRANSACTION_STORE: 'transaction.store',
  TIMELINE_STORE: 'timeline.store',
  MESSAGE_STORE: 'message.store'
};

// S3 bucket
export const S3_BUCKET = {
  LENSTER_MEDIA: 'lenster-media'
};
