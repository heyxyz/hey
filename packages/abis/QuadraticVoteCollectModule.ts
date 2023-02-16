export const QuadraticVoteCollectModule = [
  {
    inputs: [
      { internalType: 'address', name: '_lensHub', type: 'address' },
      { internalType: 'address', name: '_moduleGlobals', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'InitParamsInvalid', type: 'error' },
  { inputs: [], name: 'ModuleDataMismatch', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'collector', type: 'address' },
      { indexed: false, internalType: 'address', name: 'currency', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'CollectWithVote',
    type: 'event'
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
    name: 'MODULE_GLOBALS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' }
    ],
    name: 'getPublicationData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'currency', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint16', name: 'referralFee', type: 'uint16' },
          { internalType: 'address', name: 'grantsRoundAddress', type: 'address' },
          { internalType: 'uint256', name: 'endTimestamp', type: 'uint256' }
        ],
        internalType: 'struct ProfilePublicationData',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'initializePublicationCollectModule',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'referrerProfileId', type: 'uint256' },
      { internalType: 'address', name: 'collector', type: 'address' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'processCollect',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
