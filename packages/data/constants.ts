import packageJson from '../../package.json';
import LensEndpoint from './lens-endpoints';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const LENS_PERIPHERY = getEnvConfig().lensPeripheryAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const LIT_PROTOCOL_ENVIRONMENT = getEnvConfig().litProtocolEnvironment;

export const IS_MAINNET = API_URL === LensEndpoint.Mainnet;

// XMTP
export const XMTP_ENV = IS_MAINNET ? 'production' : 'dev';
export const XMTP_PREFIX = 'lens.dev/dm';

// Snapshot
export const SNAPSHOT_HUB_URL = IS_MAINNET
  ? 'https://hub.snapshot.org'
  : 'https://testnet.snapshot.org';
export const LENSTER_POLLS_SPACE = 'polls.lenster.xyz';
export const SNAPSHOT_URL = IS_MAINNET
  ? 'https://snapshot.org'
  : 'https://demo.snapshot.org';

// Application
export const APP_NAME = 'Lenster';
export const DESCRIPTION =
  'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿';
export const APP_VERSION = packageJson.version;

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

// Misc
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LENSPROTOCOL_HANDLE = 'lensprotocol';
export const HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test';
// TODO: Remove this once everyone has migrated to the new Lens relayer
export const OLD_LENS_RELAYER_ADDRESS =
  '0xD1FecCF6881970105dfb2b654054174007f0e07E';

// Mixpanel
export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';
export const MIXPANEL_ENABLED = MIXPANEL_TOKEN && IS_PRODUCTION;

// URLs
export const STATIC_ASSETS_URL = 'https://static-assets.lenster.xyz';
export const LENS_MEDIA_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com';
export const RARIBLE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://testnet.rarible.com';
export const IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/';
export const ARWEAVE_GATEWAY = 'https://arweave.net/';
export const EVER_API = 'https://endpoint.4everland.co';
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/logo.jpeg`;
export const IFRAMELY_URL = 'https://iframely.lenster.xyz/iframely';

// Workers
export const STS_GENERATOR_WORKER_URL = IS_PRODUCTION
  ? 'https://sts.lenster.xyz'
  : 'http://localhost:8082';
export const METADATA_WORKER_URL = IS_PRODUCTION
  ? 'https://metadata.lenster.xyz'
  : 'http://localhost:8083';
export const FRESHDESK_WORKER_URL = IS_PRODUCTION
  ? 'https://freshdesk.lenster.xyz'
  : 'http://localhost:8084';
export const SNAPSHOR_RELAY_WORKER_URL = IS_PRODUCTION
  ? 'https://snapshot-relay.lenster.xyz'
  : 'http://localhost:8085';
export const ENS_RESOLVER_WORKER_URL = 'https://ens-resolver.lenster.xyz';

// Tokens / Keys
export const ALCHEMY_KEY = '7jxlM7yIx-aJXDivcEZxsLFFRKQS6-ue';
export const WALLETCONNECT_PROJECT_ID = 'cd542acc70c2b548030f9901a52e70c8';
export const GROWTHBOOK_KEY = IS_MAINNET
  ? 'sdk-fDLRMwvpyh4Kq3b'
  : 'sdk-STENQl8vU1da648';

// Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/;
export const ADDRESS_REGEX = /^(0x)?[\da-f]{40}$/i;
export const HANDLE_REGEX = /^[\da-z]+$/;
export const RESTRICTED_SYMBOLS = '☑️✓✔✅';
export const PROFILE_NAME_VALIDATOR_REGEX = new RegExp(
  '^[^' + RESTRICTED_SYMBOLS + ']+$'
);
export const PROFILE_NAME_FILTER_REGEX = new RegExp(
  '[' + RESTRICTED_SYMBOLS + ']',
  'gu'
);
export const ALL_HANDLES_REGEX = /([\s+])@(\S+)/g;
export const HANDLE_SANITIZE_REGEX = /[^\d .A-Za-z]/g;

// Utils
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
  'audio/webm',
  'audio/flac'
];
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/quicktime'
];
export const ALLOWED_MEDIA_TYPES = [
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_AUDIO_TYPES
];

// UI
export const MESSAGE_PAGE_LIMIT = 15;
export const MIN_WIDTH_DESKTOP = 1024;

// Named transforms for ImageKit
export const AVATAR = 'tr:w-300,h-300';
export const COVER = 'tr:w-1500,h-500';
export const ATTACHMENT = 'tr:w-1000';

// S3 bucket
export const S3_BUCKET = {
  LENSTER_MEDIA: 'lenster-media'
};
