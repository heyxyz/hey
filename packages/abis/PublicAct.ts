export const PublicAct = [
  {
    inputs: [
      { internalType: 'address', name: 'lensHub', type: 'address' },
      {
        internalType: 'address',
        name: 'collectPublicationAction',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'COLLECT_PUBLICATION_ACTION',
    outputs: [
      {
        internalType: 'contract CollectPublicationAction',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'HUB',
    outputs: [{ internalType: 'contract ILensHub', name: '', type: 'address' }],
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
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'signer', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
            internalType: 'address',
            name: 'actionModuleAddress',
            type: 'address'
          },
          { internalType: 'bytes', name: 'actionModuleData', type: 'bytes' }
        ],
        internalType: 'struct Types.PublicationActionParams',
        name: 'publicationActionParams',
        type: 'tuple'
      }
    ],
    name: 'publicCollect',
    outputs: [],
    stateMutability: 'nonpayable',
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
            internalType: 'address',
            name: 'actionModuleAddress',
            type: 'address'
          },
          { internalType: 'bytes', name: 'actionModuleData', type: 'bytes' }
        ],
        internalType: 'struct Types.PublicationActionParams',
        name: 'publicationActionParams',
        type: 'tuple'
      },
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
    name: 'publicCollectWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
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
            internalType: 'address',
            name: 'actionModuleAddress',
            type: 'address'
          },
          { internalType: 'bytes', name: 'actionModuleData', type: 'bytes' }
        ],
        internalType: 'struct Types.PublicationActionParams',
        name: 'publicationActionParams',
        type: 'tuple'
      }
    ],
    name: 'publicFreeAct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
