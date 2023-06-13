export const FollowNft = [
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
