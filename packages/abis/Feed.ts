export const Feed = [
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
    name: "Lens_Feed_ExtraDataAdded",
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
    name: "Lens_Feed_ExtraDataRemoved",
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
    name: "Lens_Feed_ExtraDataUpdated",
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
    name: "Lens_Feed_MetadataURISet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "localSequentialId",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "address",
            name: "author",
            type: "address"
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string"
          },
          {
            internalType: "uint256",
            name: "repostedPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "quotedPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "repliedPostId",
            type: "uint256"
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
            internalType: "struct RuleConfiguration[]",
            name: "rules",
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
            name: "feedRulesData",
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
            name: "repostedPostRulesData",
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
            name: "quotedPostRulesData",
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
            name: "repliedPostRulesData",
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
        indexed: false,
        internalType: "struct CreatePostParams",
        name: "postParams",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rootPostId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Feed_PostCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
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
        name: "feedRulesData",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Feed_PostDeleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address"
      },
      {
        components: [
          {
            internalType: "string",
            name: "contentURI",
            type: "string"
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
        indexed: false,
        internalType: "struct EditPostParams",
        name: "newPostParams",
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
        name: "feedRulesData",
        type: "tuple"
      },
      {
        indexed: false,
        internalType: "address",
        name: "source",
        type: "address"
      }
    ],
    name: "Lens_Feed_PostEdited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
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
    name: "Lens_Feed_Post_ExtraDataAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32"
      }
    ],
    name: "Lens_Feed_Post_ExtraDataRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
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
    name: "Lens_Feed_Post_ExtraDataUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address"
      },
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
        indexed: false,
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "Lens_Feed_Post_RuleAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "ruleAddress",
        type: "address"
      }
    ],
    name: "Lens_Feed_Post_RuleRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address"
      },
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
        indexed: false,
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "Lens_Feed_Post_RuleUpdated",
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
    name: "Lens_Feed_RuleAdded",
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
    name: "Lens_Feed_RuleRemoved",
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
    name: "Lens_Feed_RuleUpdated",
    type: "event"
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
    name: "changeFeedRules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256"
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
        name: "feedRulesData",
        type: "tuple"
      }
    ],
    name: "changePostRules",
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
            name: "author",
            type: "address"
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string"
          },
          {
            internalType: "uint256",
            name: "repostedPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "quotedPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "repliedPostId",
            type: "uint256"
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
            internalType: "struct RuleConfiguration[]",
            name: "rules",
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
            name: "feedRulesData",
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
            name: "repostedPostRulesData",
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
            name: "quotedPostRulesData",
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
            name: "repliedPostRulesData",
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
        internalType: "struct CreatePostParams",
        name: "createPostParams",
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
    name: "createPost",
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
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        internalType: "bytes32[]",
        name: "extraDataKeysToDelete",
        type: "bytes32[]"
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
        name: "feedRulesData",
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
    name: "deletePost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "string",
            name: "contentURI",
            type: "string"
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
        internalType: "struct EditPostParams",
        name: "newPostParams",
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
        name: "editPostFeedRulesData",
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
    name: "editPost",
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
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "getFeedRules",
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
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      }
    ],
    name: "getPost",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "author",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "localSequentialId",
            type: "uint256"
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string"
          },
          {
            internalType: "uint256",
            name: "rootPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "repostedPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "quotedPostId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "repliedPostId",
            type: "uint256"
          },
          {
            internalType: "address[]",
            name: "requiredRules",
            type: "address[]"
          },
          {
            internalType: "address[]",
            name: "anyOfRules",
            type: "address[]"
          },
          {
            internalType: "uint80",
            name: "creationTimestamp",
            type: "uint80"
          },
          {
            internalType: "address",
            name: "creationSource",
            type: "address"
          },
          {
            internalType: "uint80",
            name: "lastUpdatedTimestamp",
            type: "uint80"
          },
          {
            internalType: "address",
            name: "lastUpdateSource",
            type: "address"
          }
        ],
        internalType: "struct Post",
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
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      }
    ],
    name: "getPostAuthor",
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
    name: "getPostCount",
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
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "key",
        type: "bytes32"
      }
    ],
    name: "getPostExtraData",
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
        internalType: "uint256",
        name: "postId",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isRequired",
        type: "bool"
      }
    ],
    name: "getPostRules",
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
  }
];
