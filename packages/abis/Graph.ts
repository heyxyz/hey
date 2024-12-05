export const Graph = [
  {
    inputs: [
      {
        internalType: "string",
        name: "metadataURI",
        type: "string"
      },
      {
        internalType: "contract IAccessControl",
        name: "accessControl",
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
    name: "Lens_Graph_ExtraDataAdded",
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
    name: "Lens_Graph_ExtraDataRemoved",
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
    name: "Lens_Graph_ExtraDataUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      },
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
        indexed: false,
        internalType: "struct RuleConfiguration",
        name: "ruleConfiguration",
        type: "tuple"
      }
    ],
    name: "Lens_Graph_Follow_RuleAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      }
    ],
    name: "Lens_Graph_Follow_RuleRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      },
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
        indexed: false,
        internalType: "struct RuleConfiguration",
        name: "ruleConfiguration",
        type: "tuple"
      }
    ],
    name: "Lens_Graph_Follow_RuleUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "followerAccount",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "accountToFollow",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "followId",
        type: "uint256"
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
        name: "graphRulesData",
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
        indexed: false,
        internalType: "struct RuleExecutionData",
        name: "followRulesData",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Graph_Followed",
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
    name: "Lens_Graph_MetadataURISet",
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
    name: "Lens_Graph_RuleAdded",
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
    name: "Lens_Graph_RuleRemoved",
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
    name: "Lens_Graph_RuleUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "followerAccount",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "accountToUnfollow",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "followId",
        type: "uint256"
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
        name: "graphRulesData",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Graph_Unfollowed",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
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
        name: "graphRulesData",
        type: "tuple"
      }
    ],
    name: "changeFollowRules",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "changeGraphRules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "followerAccount",
        type: "address"
      },
      {
        internalType: "address",
        name: "accountToFollow",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "followId",
        type: "uint256"
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
        name: "graphRulesData",
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
        name: "followRulesData",
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
    name: "follow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
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
    inputs: [
      {
        internalType: "address",
        name: "followerAccount",
        type: "address"
      },
      {
        internalType: "address",
        name: "targetAccount",
        type: "address"
      }
    ],
    name: "getFollow",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256"
          }
        ],
        internalType: "struct Follow",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
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
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "getFollowRules",
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
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "followId",
        type: "uint256"
      }
    ],
    name: "getFollowerById",
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
        name: "account",
        type: "address"
      }
    ],
    name: "getFollowersCount",
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
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "getGraphRules",
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
    inputs: [
      {
        internalType: "address",
        name: "followerAccount",
        type: "address"
      },
      {
        internalType: "address",
        name: "targetAccount",
        type: "address"
      }
    ],
    name: "isFollowing",
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
        internalType: "address",
        name: "followerAccount",
        type: "address"
      },
      {
        internalType: "address",
        name: "accountToUnfollow",
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
        internalType: "struct RuleExecutionData",
        name: "graphRulesData",
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
    name: "unfollow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
