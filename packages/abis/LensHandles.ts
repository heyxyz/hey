export const LensHandles = [
  {
    inputs: [
      { internalType: 'address', name: '_uniswapV3Router', type: 'address' },
      { internalType: 'address', name: '_madSBT', type: 'address' },
      { internalType: 'address', name: '_hub', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'BadOutputToken',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint16', name: 'percentCap', type: 'uint16' }],
    name: 'InvalidPercentCap',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint16', name: 'percentReward', type: 'uint16' }],
    name: 'InvalidPercentReward',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'rewardsPoolId', type: 'uint256' }
    ],
    name: 'InvalidRewardsPoolId',
    type: 'error'
  },
  { inputs: [], name: 'NotHub', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'FeesWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'pubId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardsPoolId',
        type: 'uint256'
      }
    ],
    name: 'PublicationActionInitialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardsPoolId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sharedReward',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'posterReward',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'referrerReward',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'clientReward',
        type: 'uint256'
      }
    ],
    name: 'RewardsPaid',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'rewardsPoolId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardsAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'percentReward',
        type: 'uint16'
      },
      { indexed: false, internalType: 'uint256', name: 'cap', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collectionId',
        type: 'uint256'
      }
    ],
    name: 'RewardsPoolCreated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'CLIENT_PERCENT',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DIRECT_PROMOTION_SPLIT',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'HUB',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PROTOCOL_FEE',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'rewardsAmount', type: 'uint256' },
      { internalType: 'uint16', name: 'percentReward', type: 'uint16' },
      { internalType: 'uint16', name: 'percentCap', type: 'uint16' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' }
    ],
    name: 'createRewardsPool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes', name: 'path', type: 'bytes' }],
    name: 'extractFinalTokenAddress',
    outputs: [{ internalType: 'address', name: 'finalToken', type: 'address' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'feesCollected',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amountIn', type: 'uint256' }],
    name: 'getSplitsTokenIn',
    outputs: [{ internalType: 'uint256', name: 'protocol', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'bool', name: 'isDirectPromotion', type: 'bool' },
      { internalType: 'uint256', name: 'percentReward', type: 'uint256' },
      { internalType: 'uint256', name: 'cap', type: 'uint256' },
      { internalType: 'uint256', name: 'remainingRewards', type: 'uint256' },
      { internalType: 'uint256', name: 'sharedRewardPercent', type: 'uint256' },
      { internalType: 'bool', name: 'isReferral', type: 'bool' },
      { internalType: 'bool', name: 'hasClient', type: 'bool' }
    ],
    name: 'getSplitsTokenOut',
    outputs: [
      { internalType: 'uint256', name: 'poster', type: 'uint256' },
      { internalType: 'uint256', name: 'swapper', type: 'uint256' },
      { internalType: 'uint256', name: 'referrer', type: 'uint256' },
      { internalType: 'uint256', name: 'client', type: 'uint256' },
      { internalType: 'uint256', name: 'lens', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'hub',
    outputs: [{ internalType: 'contract ILensHub', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'initializePublicationAction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'madSBT',
    outputs: [{ internalType: 'contract IMadSBT', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'poolCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    name: 'posts',
    outputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'rewardsPoolId', type: 'uint256' },
      { internalType: 'uint16', name: 'sharedRewardPercent', type: 'uint16' },
      { internalType: 'address', name: 'token', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationActedProfileId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'publicationActedId',
            type: 'uint256'
          },
          { internalType: 'uint256', name: 'actorProfileId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address'
          },
          {
            internalType: 'uint256[]',
            name: 'referrerProfileIds',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'referrerPubIds',
            type: 'uint256[]'
          },
          {
            internalType: 'enum Types.PublicationType[]',
            name: 'referrerPubTypes',
            type: 'uint8[]'
          },
          { internalType: 'bytes', name: 'actionModuleData', type: 'bytes' }
        ],
        internalType: 'struct Types.ProcessActionParams',
        name: 'processActionParams',
        type: 'tuple'
      }
    ],
    name: 'processPublicationAction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'rewardsPools',
    outputs: [
      { internalType: 'uint256', name: 'rewardsAmount', type: 'uint256' },
      { internalType: 'uint16', name: 'percentReward', type: 'uint16' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'cap', type: 'uint256' },
      { internalType: 'uint256', name: 'collectionId', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uniswapV3Router',
    outputs: [
      { internalType: 'contract ISwapRouter', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'withdrawProtocolFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
