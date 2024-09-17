export const HeyLensSignup = [
  { inputs: [], name: "InvalidFunds", type: "error" },
  { inputs: [], name: "InvalidInitialization", type: "error" },
  { inputs: [], name: "NotAllowed", type: "error" },
  { inputs: [], name: "NotInitializing", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  { inputs: [], name: "WithdrawalFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "profileId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "handleId",
        type: "uint256"
      }
    ],
    name: "ProfileCreated",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address[]", name: "newAddresses", type: "address[]" }
    ],
    name: "addAllowedAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "allowedAddresses",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct CreateProfileParams",
        name: "createProfileParams",
        type: "tuple"
      },
      { internalType: "string", name: "handle", type: "string" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]"
      }
    ],
    name: "createProfileWithHandle",
    outputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "handleId", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct CreateProfileParams",
        name: "createProfileParams",
        type: "tuple"
      },
      { internalType: "string", name: "handle", type: "string" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]"
      }
    ],
    name: "createProfileWithHandleUsingCredits",
    outputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "handleId", type: "uint256" }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        internalType: "address",
        name: "_lensPermissionlessCreator",
        type: "address"
      },
      { internalType: "uint256", name: "_signupPrice", type: "uint256" }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "lensPermissionlessCreator",
    outputs: [
      {
        internalType: "contract ILensPermissionlessCreator",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "profileCreated",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "profilesCreatedViaCard",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "profilesCreatedViaCrypto",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "addressToRemove", type: "address" }
    ],
    name: "removeAllowedAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "creatorAddress", type: "address" }
    ],
    name: "setLensPermissionlessCreatorAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_signupPrice", type: "uint256" }
    ],
    name: "setSignupPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "signupPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalProfilesCreated",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
