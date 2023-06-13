import packageJson from '../../package.json';
import LensEndpoint from './lens-endpoints';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_UAT = process.env.APP_ENV === 'uat';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const LIT_PROTOCOL_ENVIRONMENT = getEnvConfig().litProtocolEnvironment;
export const IS_RELAYER_AVAILABLE = getEnvConfig().isRelayerAvailable;
export const IS_RARIBLE_AVAILABLE = getEnvConfig().isRaribleAvailable;
export const IS_LIT_AVAILABLE = getEnvConfig().isLitAvailable;
export const LENS_PROFILE_CREATOR = '0x407972ca4683803a926a85963f28C71147c6DBdF';
export const LINEA_RESOLVER = '0xf9D4b242DCcbB6AB3b3Fea6750bbAb536f925bD3';
export const LENS_HUB = '0x28af365578586eD5Fd500A1Dc0a3E20Fc7b2Cffa';

export const IS_MAINNET = API_URL === LensEndpoint.Mainnet;

// XMTP
export const XMTP_ENV = IS_MAINNET ? 'production' : 'dev';
export const XMTP_PREFIX = 'lens.dev/dm';

// Application
export const APP_NAME = 'Lineaster';
export const DESCRIPTION =
  'Lineaster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿';
export const APP_VERSION = packageJson.version;

// Git
export const GIT_COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

// Misc
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LENSPROTOCOL_HANDLE = 'lensprotocol';
export const HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test';
export const OLD_LENS_RELAYER_ADDRESS = '0xD1FecCF6881970105dfb2b654054174007f0e07E';

// Mixpanel
export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';
export const MIXPANEL_ENABLED = MIXPANEL_TOKEN && IS_PRODUCTION;

// URLs
export const STATIC_ASSETS_URL = 'https://static-assets.lenster.xyz';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const LINEA_EXPLORER_URL = IS_MAINNET
  ? 'https://explorer.linea.build'
  : 'https://explorer.goerli.linea.build';
export const RARIBLE_URL = IS_MAINNET ? 'https://rarible.com' : 'https://testnet.rarible.com';
export const ZONIC_URL = IS_MAINNET ? 'https://zonic.app' : 'https://testnet.zonic.app';
export const IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/';
export const ARWEAVE_GATEWAY = 'https://arweave.net/';
export const EVER_API = 'https://endpoint.4everland.co';
export const SIMPLEANALYTICS_API = 'https://simpleanalytics.com/lenster.xyz.json';
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/logo.jpeg`;
export const IFRAMELY_URL = 'https://iframely.lenster.xyz/iframely';
export const ENS_FRONT_DEV_LINEA_URL = 'https://ens.goerli.linea.build/metadata';

// Workers
export const USER_CONTENT_URL = 'https://user-content.lenster.xyz';
export const STS_TOKEN_URL = IS_PRODUCTION ? 'https://sts.lenster.xyz' : 'http://localhost:8082';
export const METADATA_WORKER_URL = IS_PRODUCTION ? 'https://metadata.lenster.xyz' : 'http://localhost:8083';
export const FRESHDESK_WORKER_URL = IS_PRODUCTION ? 'https://freshdesk.lenster.xyz' : 'http://localhost:8084';

// Web3
export const ALCHEMY_KEY = '7jxlM7yIx-aJXDivcEZxsLFFRKQS6-ue';
export const INFURA_KEY = IS_UAT ? 'f77a2b1d1f0d434c8677a863c79419fe' : 'b4817cb2c70347559b6f0b03c53787db';

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
export const MIN_WIDTH_DESKTOP = 1024;

// Named transforms
export const AVATAR = '300x300';
export const COVER = '1500x500';
export const ATTACHMENT = '1000,fit';

// S3 bucket
export const S3_BUCKET = {
  LENSTER_MEDIA: 'lenster-media'
};

export const DISCORD_URL = 'https://discord.com/invite/9QwXqsyAps';

export const ENS_DOMAIN_URL = 'https://app.ens.domains';
