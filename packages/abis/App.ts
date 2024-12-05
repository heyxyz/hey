export const App = [
  {
    inputs: [
      {
        internalType: "string",
        name: "metadataURI",
        type: "string"
      },
      {
        internalType: "bool",
        name: "isSourceStampVerificationEnabled",
        type: "bool"
      },
      {
        internalType: "contract IAccessControl",
        name: "accessControl",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "graph",
            type: "address"
          },
          {
            internalType: "address[]",
            name: "feeds",
            type: "address[]"
          },
          {
            internalType: "address",
            name: "username",
            type: "address"
          },
          {
            internalType: "address[]",
            name: "groups",
            type: "address[]"
          },
          {
            internalType: "address",
            name: "defaultFeed",
            type: "address"
          },
          {
            internalType: "address[]",
            name: "signers",
            type: "address[]"
          },
          {
            internalType: "address",
            name: "paymaster",
            type: "address"
          },
          {
            internalType: "address",
            name: "treasury",
            type: "address"
          }
        ],
        internalType: "struct AppInitialProperties",
        name: "initialProps",
        type: "tuple"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "key",
            type: "bytes32"
          },
          {
            internalType: "bytes",
            name: "value",
            type: "bytes"
          }
        ],
        internalType: "struct DataElement[]",
        name: "extraData",
        type: "tuple[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "accessControl",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "accessControlType",
        type: "bytes32"
      }
    ],
    name: "Lens_AccessControlAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "accessControl",
        type: "address"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "accessControlType",
        type: "bytes32"
      }
    ],
    name: "Lens_AccessControlUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feed",
        type: "address"
      }
    ],
    name: "Lens_App_DefaultFeedSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "value",
        type: "bytes"
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "valueIndexed",
        type: "bytes"
      }
    ],
    name: "Lens_App_ExtraDataAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32"
      }
    ],
    name: "Lens_App_ExtraDataRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "value",
        type: "bytes"
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "valueIndexed",
        type: "bytes"
      }
    ],
    name: "Lens_App_ExtraDataUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feed",
        type: "address"
      }
    ],
    name: "Lens_App_FeedAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feed",
        type: "address"
      }
    ],
    name: "Lens_App_FeedRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "graph",
        type: "address"
      }
    ],
    name: "Lens_App_GraphAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "graph",
        type: "address"
      }
    ],
    name: "Lens_App_GraphRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "group",
        type: "address"
      }
    ],
    name: "Lens_App_GroupAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "group",
        type: "address"
      }
    ],
    name: "Lens_App_GroupRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "metadataURI",
        type: "string"
      }
    ],
    name: "Lens_App_MetadataURISet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "paymaster",
        type: "address"
      }
    ],
    name: "Lens_App_PaymasterAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "paymaster",
        type: "address"
      }
    ],
    name: "Lens_App_PaymasterRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "signer",
        type: "address"
      }
    ],
    name: "Lens_App_SignerAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "signer",
        type: "address"
      }
    ],
    name: "Lens_App_SignerRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "isEnabled",
        type: "bool"
      }
    ],
    name: "Lens_App_SourceStampVerificationSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "treasury",
        type: "address"
      }
    ],
    name: "Lens_App_TreasurySet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "username",
        type: "address"
      }
    ],
    name: "Lens_App_UsernameAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "username",
        type: "address"
      }
    ],
    name: "Lens_App_UsernameRemoved",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "feeds",
        type: "address[]"
      }
    ],
    name: "addFeeds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "groups",
        type: "address[]"
      }
    ],
    name: "addGroups",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers",
        type: "address[]"
      }
    ],
    name: "addSigners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAccessControl",
    outputs: [
      {
        internalType: "contract IAccessControl",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDefaultFeed",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDefaultGraph",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDefaultGroup",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDefaultPaymaster",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDefaultUsername",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32"
      }
    ],
    name: "getExtraData",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getFeeds",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getGraphs",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getGroups",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getMetadataURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getPaymaster",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getSigners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTreasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getUsernames",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "feeds",
        type: "address[]"
      }
    ],
    name: "removeFeeds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "groups",
        type: "address[]"
      }
    ],
    name: "removeGroups",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers",
        type: "address[]"
      }
    ],
    name: "removeSigners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IAccessControl",
        name: "newAccessControl",
        type: "address"
      }
    ],
    name: "setAccessControl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "feed",
        type: "address"
      }
    ],
    name: "setDefaultFeed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "key",
            type: "bytes32"
          },
          {
            internalType: "bytes",
            name: "value",
            type: "bytes"
          }
        ],
        internalType: "struct DataElement[]",
        name: "extraDataToSet",
        type: "tuple[]"
      }
    ],
    name: "setExtraData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "graph",
        type: "address"
      }
    ],
    name: "setGraph",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "metadataURI",
        type: "string"
      }
    ],
    name: "setMetadataURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "paymaster",
        type: "address"
      }
    ],
    name: "setPaymaster",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "isEnabled",
        type: "bool"
      }
    ],
    name: "setSourceStampVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address"
      }
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "username",
        type: "address"
      }
    ],
    name: "setUsername",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "source",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes"
          }
        ],
        internalType: "struct SourceStamp",
        name: "sourceStamp",
        type: "tuple"
      }
    ],
    name: "validateSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
