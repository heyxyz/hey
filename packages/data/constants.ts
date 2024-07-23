import packageJson from '../../package.json';
import LensEndpoint from './lens-endpoints';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';

// Lens and Hey Env Config
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK || 'mainnet';

export const LENS_API_URL = getEnvConfig().lensApiEndpoint;
export const HEY_API_URL = IS_PRODUCTION
  ? 'https://api.hey.xyz'
  : 'http://localhost:4784';
export const LENS_HUB = getEnvConfig().lensHub;
export const LENS_HANDLES = getEnvConfig().lensHandles;
export const TOKEN_HANDLE_REGISTRY = getEnvConfig().tokenHandleRegistry;
export const HEY_LENS_SIGNUP = getEnvConfig().heyLensSignup;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const PERMISSIONLESS_CREATOR = getEnvConfig().permissionlessCreator;
export const HEY_TIPPING = getEnvConfig().heyTipping;

export const IS_MAINNET = LENS_API_URL === LensEndpoint.Mainnet;
export const ADDRESS_PLACEHOLDER = '0x03Ba3...7EF';

// Application
export const APP_NAME = 'Hey';
export const DESCRIPTION = `${APP_NAME}.xyz is a decentralized, and permissionless social media app built with Lens Protocol 🌿`;
export const APP_VERSION = packageJson.version;
export const BRAND_COLOR = '#FB3A5D';
export const MAX_UINT256 = 2n ** 256n - 1n;

// Git
export const GIT_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || '0000000';

// Misc
export const WMATIC_ADDRESS = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3c9283d3e44854697cd22d3faa240cfb032889';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const PERMIT_2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
export const REWARDS_ADDRESS = '0x69696378FaEd01315c762e5122fFFBc7bab03570';
export const PRO_EOA_ADDRESS = '0xCAFEfB235AE1c10dC579338d06D90F0c89c4e5D6';
export const REWARDS_PROFILE_ID = '12'; // 0x0c
export const TEST_WALLET_ADDRESS = '0xb9C6e304545386E95d5c4ab183EE97A13555A49d';
export const TEST_PK =
  '0x8b33302ca865bc1ed65bc02b71dd02067bd3dae3da2f8bb0d95b16509e9ac71e';
export const TEST_LENS_ID = '0x43';
export const TEST_NON_STAFF_LENS_ID = '0x4c';
export const HEY_CURATED_ID = '0x0214f6';
export const ZERO_PUBLICATION_ID = '0x00-0x00';
export const HANDLE_PREFIX = 'lens/';
export const CLUB_HANDLE_PREFIX = 'club/';
export const SIGNUP_PRICE = IS_MAINNET ? 8 : 1;
export const MONTHLY_PRO_PRICE = 10;
export const HEY_MEMBERSHIP_NFT = IS_MAINNET
  ? '0x100372BBF7f975f6b1448fB11AB0F814b2740EEd'
  : '0x75120677aBF34ae95a916C6E9DbB610a06536CC3';
export const HEY_MEMBERSHIP_NFT_PUBLICATION_ID = '0x020b69-0x01';
export const DEFAULT_DECENT_OA_TOKEN = {
  contractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  decimals: 18,
  id: 'WMATIC',
  name: 'Wrapped MATIC',
  symbol: 'WMATIC'
};
export const SUPPORTED_DECENT_OA_TOKENS: Record<
  string,
  { address: `0x${string}`; visibleDecimals: number }
> = {
  USDC: {
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    visibleDecimals: 2
  },
  WETH: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    visibleDecimals: 4
  },
  WMATIC: {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    visibleDecimals: 2
  }
};

// URLs
export const STATIC_ASSETS_URL = 'https://hey-assets.b-cdn.net';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const LENS_MEDIA_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot';
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://amoy.polygonscan.com';
export const IPFS_GATEWAY = 'https://gw.ipfs-lens.dev/ipfs';
export const ARWEAVE_GATEWAY = 'https://gateway.irys.xyz';
export const EVER_API = 'https://endpoint.4everland.co';
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/cover.png`;
export const PLACEHOLDER_IMAGE = `${STATIC_IMAGES_URL}/placeholder.webp`;
export const MOONPAY_URL = IS_MAINNET
  ? 'https://buy.moonpay.com'
  : 'https://buy-sandbox.moonpay.com';
export const HEY_IMAGEKIT_URL = 'https://ik.imagekit.io/lensterimg';
export const CLUBS_API_URL = 'https://us-central1-orbapp.cloudfunctions.net';

// Tokens / Keys
export const WALLETCONNECT_PROJECT_ID = 'cd542acc70c2b548030f9901a52e70c8';
export const GIPHY_KEY = 'yNwCXMKkiBrxyyFduF56xCbSuJJM8cMd';
export const GITCOIN_PASSPORT_KEY = 'xn9e7AFv.aEfS0ioNhaVtww1jdwnsWtxnrNHspVsS';
export const LIVEPEER_KEY = '70508bf8-2e16-4594-852d-5aed798f6403';
export const ALCHEMY_API_KEY = 'Xx-4a1SyWtS9U4h0cEuRmvgYtGeVOlv7';
export const CLUBS_APP_TOKEN =
  'Qun7aDFo4FS7Dt2b9Ea8ve5TqvuXiCJXjZZTsao5Y9viFJxSEi5gYZa7DybrSzDGXST5L2vWMjBXzjsppj5RERo3AdPnJ3TVYuY2cLxBFa592rkjzU';

// Named transforms for ImageKit
export const AVATAR = 'tr:w-350,h-350';
export const EXPANDED_AVATAR = 'tr:w-1000,h-1000';
export const COVER = 'tr:w-1350,h-350';
export const VIDEO_THUMBNAIL = 'tr:h-1000';
export const ATTACHMENT = 'tr:w-1000';

// S3 bucket
export const S3_BUCKET = {
  HEY_MEDIA: 'hey-media'
};

// Feature Flags
export const VERIFIED_FEATURE_ID = 'a0d6d247-50ef-419f-a045-54fa96054922';
export const STAFF_PICK_FEATURE_ID = '73d2f48d-0291-4a36-adc2-9737057ad2b7';

// Known Lens Protocol Attributes
export const KNOWN_ATTRIBUTES = {
  HIDE_OEMBED: 'hideOembed',
  POLL_ID: 'heyPollId'
};

// Tanstack Stale Times

export const STALE_TIMES = {
  FIVE_MINUTES: 5 * 60 * 1000,
  SIX_HOURS: 6 * 60 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000
};
