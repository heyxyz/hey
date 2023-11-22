export const TokenHandleRegistry = [
  {
    inputs: [
      { internalType: 'address', name: 'lensHub', type: 'address' },
      { internalType: 'address', name: 'lensHandles', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'DoesNotExist', type: 'error' },
  { inputs: [], name: 'DoesNotHavePermissions', type: 'error' },
  { inputs: [], name: 'HandleAndTokenNotInSameWallet', type: 'error' },
  { inputs: [], name: 'NotHandleNorTokenOwner', type: 'error' },
  { inputs: [], name: 'NotLinked', type: 'error' },
  { inputs: [], name: 'OnlyLensHub', type: 'error' },
  { inputs: [], name: 'SignatureExpired', type: 'error' },
  { inputs: [], name: 'SignatureInvalid', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'collection', type: 'address' }
        ],
        indexed: false,
        internalType: 'struct RegistryTypes.Handle',
        name: 'handle',
        type: 'tuple'
      },
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'collection', type: 'address' }
        ],
        indexed: false,
        internalType: 'struct RegistryTypes.Token',
        name: 'token',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'transactionExecutor',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'HandleLinked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'collection', type: 'address' }
        ],
        indexed: false,
        internalType: 'struct RegistryTypes.Handle',
        name: 'handle',
        type: 'tuple'
      },
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'collection', type: 'address' }
        ],
        indexed: false,
        internalType: 'struct RegistryTypes.Token',
        name: 'token',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'transactionExecutor',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'HandleUnlinked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'signer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'NonceUpdated',
    type: 'event'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'profileId', type: 'uint256' }],
    name: 'getDefaultHandle',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'increment', type: 'uint8' }],
    name: 'incrementNonce',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'handleId', type: 'uint256' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' }
    ],
    name: 'link',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'handleId', type: 'uint256' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      {
        components: [
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        internalType: 'struct Types.EIP712Signature',
        name: 'signature',
        type: 'tuple'
      }
    ],
    name: 'linkWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'handleId', type: 'uint256' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' }
    ],
    name: 'migrationLink',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'signer', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'handleId', type: 'uint256' }],
    name: 'resolve',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'handleId', type: 'uint256' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' }
    ],
    name: 'unlink',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'handleId', type: 'uint256' },
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      {
        components: [
          { internalType: 'address', name: 'signer', type: 'address' },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        internalType: 'struct Types.EIP712Signature',
        name: 'signature',
        type: 'tuple'
      }
    ],
    name: 'unlinkWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
