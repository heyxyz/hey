import packageJson from '../../package.json';
import LensEndpoint from './lens-endpoints';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? 'mainnet';

export const API_URL = getEnvConfig().apiEndpoint;
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress;
export const PUBLICACT_PROXY = getEnvConfig().publicActProxyAddress;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const LIT_PROTOCOL_ENVIRONMENT = getEnvConfig().litProtocolEnvironment;

export const IS_MAINNET = API_URL === LensEndpoint.Mainnet;
export const REWARDS_ADDRESS = '0xf618330f51fa54ce5951d627ee150c0fdadeba43';
export const ADDRESS_PLACEHOLDER = '0x03Ba3...7EF';

// Snapshot
export const HEY_POLLS_SPACE = 'polls.lenster.xyz';
export const SNAPSHOT_HUB_URL = 'https://hub.snapshot.org';
export const SNAPSHOT_SEQUNECER_URL = 'https://seq.snapshot.org';
export const SNAPSHOT_URL = 'https://snapshot.org';

// Application
export const APP_NAME = 'Hey';
export const DESCRIPTION = `${APP_NAME}.xyz is a decentralized, and permissionless social media app built with Lens Protocol 🌿`;
export const APP_VERSION = packageJson.version;
export const BRAND_COLOR = '#FB3A5D';

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

// Misc
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const HANDLE_PREFIX = IS_MAINNET ? 'lens/' : 'test/';

// URLs
export const HEY_API_URL = IS_PRODUCTION
  ? 'https://api.hey.xyz'
  : 'http://localhost:4785';
export const STATIC_ASSETS_URL = 'https://static-assets.hey.xyz';
export const LENS_MEDIA_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com';
export const RARIBLE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://testnet.rarible.com';
export const IPFS_GATEWAY = 'https://gw.ipfs-lens.dev/ipfs/';
export const ARWEAVE_GATEWAY = 'https://arweave.net/';
export const EVER_API = 'https://endpoint.4everland.co';
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/logo.jpeg`;
export const PLACEHOLDER_IMAGE = `${STATIC_IMAGES_URL}/placeholder.webp`;

// Workers (Cloudflare)
export const METADATA_WORKER_URL = IS_PRODUCTION
  ? 'https://metadata.hey.xyz'
  : 'http://localhost:8083';
export const SNAPSHOR_RELAY_WORKER_URL = IS_PRODUCTION
  ? 'https://snapshot-relay.hey.xyz'
  : 'http://localhost:8084';
export const OEMBED_WORKER_URL = IS_PRODUCTION
  ? 'https://oembed.hey.xyz'
  : 'http://localhost:8086';
export const LEAFWATCH_WORKER_URL = IS_PRODUCTION
  ? 'https://leafwatch.hey.xyz'
  : 'http://localhost:8087';
export const STATS_WORKER_URL = IS_PRODUCTION
  ? 'https://stats.hey.xyz'
  : 'http://localhost:8088';
export const FEEDS_WORKER_URL = IS_PRODUCTION
  ? 'https://feeds.hey.xyz'
  : 'http://localhost:8089';
export const PREFERENCES_WORKER_URL = IS_PRODUCTION
  ? 'https://preferences.hey.xyz'
  : 'http://localhost:8090';
export const GROUPS_WORKER_URL = IS_PRODUCTION
  ? 'https://groups.hey.xyz'
  : 'http://localhost:8091';
export const NFT_WORKER_URL = IS_PRODUCTION
  ? 'https://nft.hey.xyz'
  : 'http://localhost:8092';
export const STAFF_PICKS_WORKER_URL = IS_PRODUCTION
  ? 'https://staff-picks.hey.xyz'
  : 'http://localhost:8093';
export const LIVE_WORKER_URL = IS_PRODUCTION
  ? 'https://live.hey.xyz'
  : 'http://localhost:8094';

// Tokens / Keys
export const OPENSEA_KEY = '8b95f9e6d52b42fe8c19ddea847c0f5d';
export const WALLETCONNECT_PROJECT_ID = 'cd542acc70c2b548030f9901a52e70c8';
export const GIPHY_KEY = 'yNwCXMKkiBrxyyFduF56xCbSuJJM8cMd';
export const GITCOIN_PASSPORT_KEY = 'xn9e7AFv.aEfS0ioNhaVtww1jdwnsWtxnrNHspVsS';

// Named transforms for ImageKit
export const AVATAR = 'tr:w-300,h-300';
export const EXPANDED_AVATAR = 'tr:w-1000,h-1000';
export const COVER = 'tr:w-1500,h-500';
export const ATTACHMENT = 'tr:w-1000';

// S3 bucket
export const S3_BUCKET = {
  HEY_MEDIA: 'hey-media'
};
