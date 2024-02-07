export const HeyLensSignup = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'newBeneficiary',
        type: 'address'
      }
    ],
    name: 'changeBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
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
            internalType: 'address',
            name: 'followModule',
            type: 'address'
          },
          {
            internalType: 'bytes',
            name: 'followModuleInitData',
            type: 'bytes'
          }
        ],
        internalType: 'struct CreateProfileParams',
        name: 'createProfileParams',
        type: 'tuple'
      },
      {
        internalType: 'string',
        name: 'handle',
        type: 'string'
      },
      {
        internalType: 'address[]',
        name: 'delegatedExecutors',
        type: 'address[]'
      }
    ],
    name: 'createProfileWithHandleUsingCredits',
    outputs: [
      {
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'handleId',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'permissionlessCreator',
        type: 'address'
      },
      {
        internalType: 'address payable',
        name: 'beneficiary_',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'InvalidFunds',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'beneficiary',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PERMISSIONLESS_CREATOR',
    outputs: [
      {
        internalType: 'contract IPermissionlessCreator',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'profileWithHandleCreationCost',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
