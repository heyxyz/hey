import packageJson from '../../package.json';
import LensEndpoint from './lens-endpoints';
import getEnvConfig from './utils/getEnvConfig';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

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
export const LENS_PROFILE_CREATOR = '0xfA91DD7A9CBbBC48a85b42745d9394c3938E90bE';
export const LENS_PROFILE_CREATOR_ABI = [
  {
    inputs: [
      {
        internalType: 'contract ILensHub',
        name: 'hub',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'HandleContainsInvalidCharacters',
    type: 'error'
  },
  {
    inputs: [],
    name: 'HandleFirstCharInvalid',
    type: 'error'
  },
  {
    inputs: [],
    name: 'HandleLengthInvalid',
    type: 'error'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'handle',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'imageURI',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'followModule',
            type: 'address'
          },
          {
            internalType: 'bytes',
            name: 'followModuleInitData',
            type: 'bytes'
          },
          {
            internalType: 'string',
            name: 'followNFTURI',
            type: 'string'
          }
        ],
        internalType: 'struct DataTypes.CreateProfileData',
        name: 'vars',
        type: 'tuple'
      }
    ],
    name: 'proxyCreateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
export const LINEA_RESOLVER = '0x117F113aEFb9AeD23d901C1fa02fDdaA1d20cCaB';
export const LINEA_RESOLVER_ABI = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'string', name: '_name', internalType: 'string' },
      { type: 'string', name: '_symbol', internalType: 'string' },
      { type: 'string', name: 'baseURI', internalType: 'string' }
    ]
  },
  {
    type: 'event',
    name: 'AddrChanged',
    inputs: [
      { type: 'bytes32', name: 'node', internalType: 'bytes32', indexed: true },
      { type: 'address', name: 'a', internalType: 'address', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address', indexed: true },
      { type: 'address', name: 'approved', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256', indexed: true }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'ApprovalForAll',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address', indexed: true },
      { type: 'address', name: 'operator', internalType: 'address', indexed: true },
      { type: 'bool', name: 'approved', internalType: 'bool', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { type: 'address', name: 'previousOwner', internalType: 'address', indexed: true },
      { type: 'address', name: 'newOwner', internalType: 'address', indexed: true }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address', indexed: true },
      { type: 'address', name: 'to', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256', indexed: true }
    ],
    anonymous: false
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'addresses',
    inputs: [{ type: 'bytes32', name: '', internalType: 'bytes32' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'approve',
    inputs: [
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'balanceOf',
    inputs: [{ type: 'address', name: 'owner', internalType: 'address' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'baseFee',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'burn',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'exists',
    inputs: [{ type: 'uint256', name: '_tokenId', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'getApproved',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'isApprovedForAll',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address' },
      { type: 'address', name: 'operator', internalType: 'address' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'payable',
    outputs: [],
    name: 'mintSubdomain',
    inputs: [
      { type: 'string', name: 'name', internalType: 'string' },
      { type: 'address', name: '_addr', internalType: 'address' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'name',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'owner',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'ownerOf',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }]
  },
  { type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'renounceOwnership', inputs: [] },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'resolve',
    inputs: [{ type: 'bytes32', name: 'node', internalType: 'bytes32' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
      { type: 'bytes', name: 'data', internalType: 'bytes' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setApprovalForAll',
    inputs: [
      { type: 'address', name: 'operator', internalType: 'address' },
      { type: 'bool', name: 'approved', internalType: 'bool' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setBaseFee',
    inputs: [{ type: 'uint256', name: 'newBaseFee', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'setBaseTokenURI',
    inputs: [{ type: 'string', name: 'baseURI', internalType: 'string' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'supportsInterface',
    inputs: [{ type: 'bytes4', name: 'interfaceId', internalType: 'bytes4' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'symbol',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'tokenByIndex',
    inputs: [{ type: 'uint256', name: 'index', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'tokenDomains',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'tokenName',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address' },
      { type: 'uint256', name: 'index', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'tokenURI',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'totalSupply',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [{ type: 'address', name: 'newOwner', internalType: 'address' }]
  }
];
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
export const ENS_FRONT_DEV_LINEA_URL = 'https://ensfront.dev.linea.build/metadata';

// Workers
export const USER_CONTENT_URL = 'https://user-content.lenster.xyz';
export const STS_TOKEN_URL = IS_PRODUCTION ? 'https://sts.lenster.xyz' : 'http://localhost:8082';
export const METADATA_WORKER_URL = IS_PRODUCTION ? 'https://metadata.lenster.xyz' : 'http://localhost:8083';
export const FRESHDESK_WORKER_URL = IS_PRODUCTION ? 'https://freshdesk.lenster.xyz' : 'http://localhost:8084';

// Web3
export const ALCHEMY_KEY = '7jxlM7yIx-aJXDivcEZxsLFFRKQS6-ue';
export const WALLETCONNECT_PROJECT_ID = 'cd542acc70c2b548030f9901a52e70c8';

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
