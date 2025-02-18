import packageJson from "../../package.json";
import LensEndpoint from "./lens-endpoints";
import getEnvConfig from "./utils/getEnvConfig";

// Environments
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

// Lens and Hey Env Config
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK || "mainnet";

export const LENS_API_URL = getEnvConfig().lensApiEndpoint;
export const DEFAULT_COLLECT_TOKEN = getEnvConfig().defaultCollectToken;
export const HEY_APP = getEnvConfig().appAddress;
export const HEY_SPONSOR = getEnvConfig().sponsorAddress;
export const HEY_API_URL = IS_PRODUCTION
  ? "https://api.hey.xyz"
  : "http://localhost:4784";

export const IS_MAINNET = LENS_API_URL === LensEndpoint.Mainnet;
export const ADDRESS_PLACEHOLDER = "0x03Ba3...7EF";

// Application
export const APP_NAME = "Hey";
export const DESCRIPTION = `${APP_NAME}.xyz is a decentralized, and permissionless social media app built with Lens Protocol 🌿`;
export const APP_VERSION = packageJson.version;
export const BRAND_COLOR = "#FB3A5D";

// URLs
export const STATIC_ASSETS_URL = "https://hey-assets.b-cdn.net";
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const LENS_MEDIA_SNAPSHOT_URL =
  "https://ik.imagekit.io/lens/media-snapshot";
export const STORAGE_NODE_URL = "https://storage-api.testnet.lens.dev/";
export const DEFAULT_OG = `${STATIC_IMAGES_URL}/og/cover.png`;
export const DEFAULT_AVATAR = `${STATIC_IMAGES_URL}/default.png`;
export const PLACEHOLDER_IMAGE = `${STATIC_IMAGES_URL}/placeholder.webp`;
export const HEY_IMAGEKIT_URL = "https://ik.imagekit.io/lensterimg";

// Tokens / Keys
export const WALLETCONNECT_PROJECT_ID = "cd542acc70c2b548030f9901a52e70c8";
export const GIPHY_KEY = "yNwCXMKkiBrxyyFduF56xCbSuJJM8cMd";
export const LIVEPEER_KEY = "70508bf8-2e16-4594-852d-5aed798f6403";
export const UNLEASH_API_TOKEN =
  "*:production.1cc40547dde90e0b342a3dffa825d52a9d9e13597c9dedea480aa9c0";

// Named transforms for ImageKit
export const AVATAR = "tr:w-350,h-350";
export const EXPANDED_AVATAR = "tr:w-1000,h-1000";
export const COVER = "tr:w-1350,h-350";
export const VIDEO_THUMBNAIL = "tr:h-1000";
export const ATTACHMENT = "tr:w-1000";

// Known Lens Protocol Attributes
export const KNOWN_ATTRIBUTES = {
  HIDE_OEMBED: "hideOembed",
  POLL_ID: "heyPollId"
};
