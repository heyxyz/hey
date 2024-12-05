export const Username = [
  {
    inputs: [
      {
        internalType: "string",
        name: "namespace",
        type: "string"
      },
      {
        internalType: "string",
        name: "metadataURI",
        type: "string"
      },
      {
        internalType: "contract IAccessControl",
        name: "accessControl",
        type: "address"
      },
      {
        internalType: "string",
        name: "nftName",
        type: "string"
      },
      {
        internalType: "string",
        name: "nftSymbol",
        type: "string"
      },
      {
        internalType: "contract ITokenURIProvider",
        name: "tokenURIProvider",
        type: "address"
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
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
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
        name: "tokenURIProvider",
        type: "address"
      }
    ],
    name: "Lens_ERC721_TokenURIProviderSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "dataForRequiredRules",
            type: "bytes[]"
          },
          {
            internalType: "bytes[]",
            name: "dataForAnyOfRules",
            type: "bytes[]"
          }
        ],
        indexed: false,
        internalType: "struct RuleExecutionData",
        name: "data",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Username_Assigned",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "dataForRequiredRules",
            type: "bytes[]"
          },
          {
            internalType: "bytes[]",
            name: "dataForAnyOfRules",
            type: "bytes[]"
          }
        ],
        indexed: false,
        internalType: "struct RuleExecutionData",
        name: "data",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Username_Created",
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
    name: "Lens_Username_ExtraDataAdded",
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
    name: "Lens_Username_ExtraDataRemoved",
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
    name: "Lens_Username_ExtraDataUpdated",
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
    name: "Lens_Username_MetadataURISet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Username_Removed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "configData",
        type: "bytes"
      },
      {
        indexed: true,
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "Lens_Username_RuleAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      }
    ],
    name: "Lens_Username_RuleRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "configData",
        type: "bytes"
      },
      {
        indexed: true,
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "Lens_Username_RuleUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Lens_Username_Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        indexed: true,
        internalType: "address",
        name: "previousAccount",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Username_Unassigned",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string"
      }
    ],
    name: "accountOf",
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
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "dataForRequiredRules",
            type: "bytes[]"
          },
          {
            internalType: "bytes[]",
            name: "dataForAnyOfRules",
            type: "bytes[]"
          }
        ],
        internalType: "struct RuleExecutionData",
        name: "data",
        type: "tuple"
      },
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
    name: "assignUsername",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "ruleAddress",
                type: "address"
              },
              {
                internalType: "bytes",
                name: "configData",
                type: "bytes"
              },
              {
                internalType: "bool",
                name: "isRequired",
                type: "bool"
              }
            ],
            internalType: "struct RuleConfiguration",
            name: "configuration",
            type: "tuple"
          },
          {
            internalType: "enum RuleOperation",
            name: "operation",
            type: "uint8"
          }
        ],
        internalType: "struct RuleChange[]",
        name: "ruleChanges",
        type: "tuple[]"
      }
    ],
    name: "changeUsernameRules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "dataForRequiredRules",
            type: "bytes[]"
          },
          {
            internalType: "bytes[]",
            name: "dataForAnyOfRules",
            type: "bytes[]"
          }
        ],
        internalType: "struct RuleExecutionData",
        name: "createData",
        type: "tuple"
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "dataForRequiredRules",
            type: "bytes[]"
          },
          {
            internalType: "bytes[]",
            name: "dataForAnyOfRules",
            type: "bytes[]"
          }
        ],
        internalType: "struct RuleExecutionData",
        name: "assignData",
        type: "tuple"
      },
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
    name: "createAndAssignUsername",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "string",
        name: "username",
        type: "string"
      },
      {
        components: [
          {
            internalType: "bytes[]",
            name: "dataForRequiredRules",
            type: "bytes[]"
          },
          {
            internalType: "bytes[]",
            name: "dataForAnyOfRules",
            type: "bytes[]"
          }
        ],
        internalType: "struct RuleExecutionData",
        name: "data",
        type: "tuple"
      },
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
    name: "createUsername",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getApproved",
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
    name: "getNamespace",
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
    inputs: [
      {
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "getUsernameRules",
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
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ownerOf",
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
        internalType: "string",
        name: "username",
        type: "string"
      },
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
    name: "removeUsername",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "safeTransferFrom",
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
        name: "operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
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
        internalType: "contract ITokenURIProvider",
        name: "tokenURIProvider",
        type: "address"
      }
    ],
    name: "setTokenURIProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "tokenURI",
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
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "username",
        type: "string"
      },
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
    name: "unassignUsername",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "usernameOf",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
