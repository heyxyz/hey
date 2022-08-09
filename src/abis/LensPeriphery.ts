export const LensPeriphery = [
  {
    inputs: [{ internalType: 'contract ILensHub', name: 'hub', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'ArrayMismatch', type: 'error' },
  { inputs: [], name: 'FollowInvalid', type: 'error' },
  { inputs: [], name: 'NotProfileOwnerOrDispatcher', type: 'error' },
  { inputs: [], name: 'SignatureExpired', type: 'error' },
  { inputs: [], name: 'SignatureInvalid', type: 'error' },
  { inputs: [], name: 'TokenDoesNotExist', type: 'error' },
  {
    inputs: [],
    name: 'HUB',
    outputs: [{ internalType: 'contract ILensHub', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'NAME',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'profileId', type: 'uint256' }],
    name: 'getProfileMetadataURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'string', name: 'metadata', type: 'string' }
    ],
    name: 'setProfileMetadataURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'profileId', type: 'uint256' },
          { internalType: 'string', name: 'metadata', type: 'string' },
          {
            components: [
              { internalType: 'uint8', name: 'v', type: 'uint8' },
              { internalType: 'bytes32', name: 'r', type: 'bytes32' },
              { internalType: 'bytes32', name: 's', type: 'bytes32' },
              {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256'
              }
            ],
            internalType: 'struct DataTypes.EIP712Signature',
            name: 'sig',
            type: 'tuple'
          }
        ],
        internalType: 'struct DataTypes.SetProfileMetadataWithSigData',
        name: 'vars',
        type: 'tuple'
      }
    ],
    name: 'setProfileMetadataURIWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'sigNonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'profileIds',
        type: 'uint256[]'
      },
      { internalType: 'bool[]', name: 'enables', type: 'bool[]' }
    ],
    name: 'toggleFollow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'follower', type: 'address' },
          {
            internalType: 'uint256[]',
            name: 'profileIds',
            type: 'uint256[]'
          },
          { internalType: 'bool[]', name: 'enables', type: 'bool[]' },
          {
            components: [
              { internalType: 'uint8', name: 'v', type: 'uint8' },
              { internalType: 'bytes32', name: 'r', type: 'bytes32' },
              { internalType: 'bytes32', name: 's', type: 'bytes32' },
              {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256'
              }
            ],
            internalType: 'struct DataTypes.EIP712Signature',
            name: 'sig',
            type: 'tuple'
          }
        ],
        internalType: 'struct DataTypes.ToggleFollowWithSigData',
        name: 'vars',
        type: 'tuple'
      }
    ],
    name: 'toggleFollowWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
