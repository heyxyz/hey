export const LensHub = [
  {
    inputs: [
      { internalType: "address", name: "followNFTImpl", type: "address" },
      { internalType: "address", name: "collectNFTImpl", type: "address" },
      { internalType: "address", name: "moduleRegistry", type: "address" },
      {
        internalType: "uint256",
        name: "tokenGuardianCooldown",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "address",
            name: "lensHandlesAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "tokenHandleRegistryAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "legacyFeeFollowModule",
            type: "address"
          },
          {
            internalType: "address",
            name: "legacyProfileFollowModule",
            type: "address"
          },
          {
            internalType: "address",
            name: "newFeeFollowModule",
            type: "address"
          }
        ],
        internalType: "struct Types.MigrationParams",
        name: "migrationParams",
        type: "tuple"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "AlreadyEnabled", type: "error" },
  { inputs: [], name: "CallerNotCollectNFT", type: "error" },
  { inputs: [], name: "CallerNotFollowNFT", type: "error" },
  { inputs: [], name: "CannotInitImplementation", type: "error" },
  { inputs: [], name: "DisablingAlreadyTriggered", type: "error" },
  { inputs: [], name: "ExecutorInvalid", type: "error" },
  { inputs: [], name: "GuardianEnabled", type: "error" },
  { inputs: [], name: "InitParamsInvalid", type: "error" },
  { inputs: [], name: "Initialized", type: "error" },
  { inputs: [], name: "InvalidOwner", type: "error" },
  { inputs: [], name: "InvalidParameter", type: "error" },
  { inputs: [], name: "NonERC721ReceiverImplementer", type: "error" },
  { inputs: [], name: "NotAllowed", type: "error" },
  { inputs: [], name: "NotEOA", type: "error" },
  { inputs: [], name: "NotGovernance", type: "error" },
  { inputs: [], name: "NotHub", type: "error" },
  { inputs: [], name: "NotMigrationAdmin", type: "error" },
  { inputs: [], name: "NotOwnerOrApproved", type: "error" },
  { inputs: [], name: "NotProfileOwner", type: "error" },
  { inputs: [], name: "NotWhitelisted", type: "error" },
  { inputs: [], name: "Paused", type: "error" },
  { inputs: [], name: "PublishingPaused", type: "error" },
  { inputs: [], name: "TokenDoesNotExist", type: "error" },
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
      { indexed: false, internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256"
      }
    ],
    name: "BatchMetadataUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "profileId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pubId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "collectNFTId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address"
      },
      { indexed: false, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "CollectNFTTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        indexed: false,
        internalType: "bytes20",
        name: "gitCommit",
        type: "bytes20"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "LensUpgradeVersion",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address"
      },
      { indexed: true, internalType: "bool", name: "enabled", type: "bool" },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenGuardianDisablingTimestamp",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "TokenGuardianStateChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint16",
        name: "prevTreasuryFee",
        type: "uint16"
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "newTreasuryFee",
        type: "uint16"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "TreasuryFeeSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevTreasury",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newTreasury",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "TreasurySet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "unfollowerProfileId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "idOfProfileUnfollowed",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "transactionExecutor",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "Unfollowed",
    type: "event"
  },
  {
    inputs: [],
    name: "DANGER__disableTokenGuardian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "TOKEN_GUARDIAN_COOLDOWN",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "publicationActedProfileId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "publicationActedId",
            type: "uint256"
          },
          { internalType: "uint256", name: "actorProfileId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          {
            internalType: "address",
            name: "actionModuleAddress",
            type: "address"
          },
          { internalType: "bytes", name: "actionModuleData", type: "bytes" }
        ],
        internalType: "struct Types.PublicationActionParams",
        name: "publicationActionParams",
        type: "tuple"
      }
    ],
    name: "act",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "publicationActedProfileId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "publicationActedId",
            type: "uint256"
          },
          { internalType: "uint256", name: "actorProfileId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          {
            internalType: "address",
            name: "actionModuleAddress",
            type: "address"
          },
          { internalType: "bytes", name: "actionModuleData", type: "bytes" }
        ],
        internalType: "struct Types.PublicationActionParams",
        name: "publicationActionParams",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "actWithSig",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "profileIds", type: "uint256[]" }
    ],
    name: "batchMigrateFollowModules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "followerProfileIds",
        type: "uint256[]"
      },
      { internalType: "uint256", name: "idOfProfileFollowed", type: "uint256" },
      { internalType: "uint256[]", name: "followTokenIds", type: "uint256[]" }
    ],
    name: "batchMigrateFollowers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "followerProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfileFollowed",
        type: "uint256[]"
      },
      { internalType: "uint256[]", name: "followTokenIds", type: "uint256[]" }
    ],
    name: "batchMigrateFollows",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "profileIds", type: "uint256[]" }
    ],
    name: "batchMigrateProfiles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]"
      },
      { internalType: "bool[]", name: "approvals", type: "bool[]" },
      { internalType: "uint64", name: "configNumber", type: "uint64" },
      { internalType: "bool", name: "switchToGivenConfig", type: "bool" }
    ],
    name: "changeDelegatedExecutorsConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]"
      },
      { internalType: "bool[]", name: "approvals", type: "bool[]" }
    ],
    name: "changeDelegatedExecutorsConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]"
      },
      { internalType: "bool[]", name: "approvals", type: "bool[]" },
      { internalType: "uint64", name: "configNumber", type: "uint64" },
      { internalType: "bool", name: "switchToGivenConfig", type: "bool" },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "changeDelegatedExecutorsConfigWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "publicationCollectedProfileId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "publicationCollectedId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "collectorProfileId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "referrerProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "referrerPubId", type: "uint256" },
          { internalType: "bytes", name: "collectModuleData", type: "bytes" }
        ],
        internalType: "struct Types.LegacyCollectParams",
        name: "collectParams",
        type: "tuple"
      }
    ],
    name: "collectLegacy",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "publicationCollectedProfileId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "publicationCollectedId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "collectorProfileId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "referrerProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "referrerPubId", type: "uint256" },
          { internalType: "bytes", name: "collectModuleData", type: "bytes" }
        ],
        internalType: "struct Types.LegacyCollectParams",
        name: "collectParams",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "collectLegacyWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "referenceModuleData", type: "bytes" },
          {
            internalType: "address[]",
            name: "actionModules",
            type: "address[]"
          },
          {
            internalType: "bytes[]",
            name: "actionModulesInitDatas",
            type: "bytes[]"
          },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct Types.CommentParams",
        name: "commentParams",
        type: "tuple"
      }
    ],
    name: "comment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "referenceModuleData", type: "bytes" },
          {
            internalType: "address[]",
            name: "actionModules",
            type: "address[]"
          },
          {
            internalType: "bytes[]",
            name: "actionModulesInitDatas",
            type: "bytes[]"
          },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct Types.CommentParams",
        name: "commentParams",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "commentWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
        internalType: "struct Types.CreateProfileParams",
        name: "createProfileParams",
        type: "tuple"
      }
    ],
    name: "createProfile",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
      { internalType: "uint256", name: "collectNFTId", type: "uint256" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" }
    ],
    name: "emitCollectNFTTransferEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "unfollowerProfileId", type: "uint256" },
      {
        internalType: "uint256",
        name: "idOfProfileUnfollowed",
        type: "uint256"
      },
      { internalType: "address", name: "transactionExecutor", type: "address" }
    ],
    name: "emitUnfollowedEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "emitVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "enableTokenGuardian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "exists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "followerProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfilesToFollow",
        type: "uint256[]"
      },
      { internalType: "uint256[]", name: "followTokenIds", type: "uint256[]" },
      { internalType: "bytes[]", name: "datas", type: "bytes[]" }
    ],
    name: "follow",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "followerProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfilesToFollow",
        type: "uint256[]"
      },
      { internalType: "uint256[]", name: "followTokenIds", type: "uint256[]" },
      { internalType: "bytes[]", name: "datas", type: "bytes[]" },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "followWithSig",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" }
    ],
    name: "getContentURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" }
    ],
    name: "getDelegatedExecutorsConfigNumber",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" }
    ],
    name: "getDelegatedExecutorsMaxConfigNumberSet",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" }
    ],
    name: "getDelegatedExecutorsPrevConfigNumber",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getFollowModule",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getFollowNFTImpl",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getFollowTokenURIContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getGitCommit",
    outputs: [{ internalType: "bytes20", name: "", type: "bytes20" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "getGovernance",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getLegacyCollectNFTImpl",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getModuleRegistry",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getProfile",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "pubCount", type: "uint256" },
          { internalType: "address", name: "followModule", type: "address" },
          { internalType: "address", name: "followNFT", type: "address" },
          {
            internalType: "string",
            name: "__DEPRECATED__handle",
            type: "string"
          },
          {
            internalType: "string",
            name: "__DEPRECATED__imageURI",
            type: "string"
          },
          {
            internalType: "string",
            name: "__DEPRECATED__followNFTURI",
            type: "string"
          },
          { internalType: "string", name: "metadataURI", type: "string" }
        ],
        internalType: "struct Types.Profile",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "handleHash", type: "bytes32" }],
    name: "getProfileIdByHandleHash",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getProfileTokenURIContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" }
    ],
    name: "getPublication",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "address",
            name: "__DEPRECATED__collectModule",
            type: "address"
          },
          {
            internalType: "address",
            name: "__DEPRECATED__collectNFT",
            type: "address"
          },
          {
            internalType: "enum Types.PublicationType",
            name: "pubType",
            type: "uint8"
          },
          { internalType: "uint256", name: "rootProfileId", type: "uint256" },
          { internalType: "uint256", name: "rootPubId", type: "uint256" }
        ],
        internalType: "struct Types.PublicationMemory",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" }
    ],
    name: "getPublicationType",
    outputs: [
      { internalType: "enum Types.PublicationType", name: "", type: "uint8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getState",
    outputs: [
      { internalType: "enum Types.ProtocolState", name: "", type: "uint8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "getTokenGuardianDisablingTimestamp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTreasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTreasuryData",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint16", name: "", type: "uint16" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTreasuryFee",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getVersion",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint8", name: "increment", type: "uint8" }],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "address", name: "newGovernance", type: "address" }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "pubId", type: "uint256" },
      { internalType: "address", name: "module", type: "address" }
    ],
    name: "isActionModuleEnabledInPublication",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" }
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "uint256", name: "byProfileId", type: "uint256" }
    ],
    name: "isBlocked",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" },
      { internalType: "address", name: "delegatedExecutor", type: "address" }
    ],
    name: "isDelegatedExecutorApproved",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "delegatorProfileId", type: "uint256" },
      { internalType: "address", name: "delegatedExecutor", type: "address" },
      { internalType: "uint64", name: "configNumber", type: "uint64" }
    ],
    name: "isDelegatedExecutorApproved",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "followedProfileId", type: "uint256" },
      { internalType: "address", name: "followerAddress", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "isFollowing",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "followerProfileId", type: "uint256" },
      { internalType: "uint256", name: "followedProfileId", type: "uint256" }
    ],
    name: "isFollowing",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "profileCreator", type: "address" }
    ],
    name: "isProfileCreatorWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "mintTimestampOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "metadataURI", type: "string" },
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "referenceModuleData", type: "bytes" }
        ],
        internalType: "struct Types.MirrorParams",
        name: "mirrorParams",
        type: "tuple"
      }
    ],
    name: "mirror",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "metadataURI", type: "string" },
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "referenceModuleData", type: "bytes" }
        ],
        internalType: "struct Types.MirrorParams",
        name: "mirrorParams",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "mirrorWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "signer", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "address[]",
            name: "actionModules",
            type: "address[]"
          },
          {
            internalType: "bytes[]",
            name: "actionModulesInitDatas",
            type: "bytes[]"
          },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct Types.PostParams",
        name: "postParams",
        type: "tuple"
      }
    ],
    name: "post",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "address[]",
            name: "actionModules",
            type: "address[]"
          },
          {
            internalType: "bytes[]",
            name: "actionModulesInitDatas",
            type: "bytes[]"
          },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct Types.PostParams",
        name: "postParams",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "postWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "referenceModuleData", type: "bytes" },
          {
            internalType: "address[]",
            name: "actionModules",
            type: "address[]"
          },
          {
            internalType: "bytes[]",
            name: "actionModulesInitDatas",
            type: "bytes[]"
          },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct Types.QuoteParams",
        name: "quoteParams",
        type: "tuple"
      }
    ],
    name: "quote",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "profileId", type: "uint256" },
          { internalType: "string", name: "contentURI", type: "string" },
          {
            internalType: "uint256",
            name: "pointedProfileId",
            type: "uint256"
          },
          { internalType: "uint256", name: "pointedPubId", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "referrerProfileIds",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "referrerPubIds",
            type: "uint256[]"
          },
          { internalType: "bytes", name: "referenceModuleData", type: "bytes" },
          {
            internalType: "address[]",
            name: "actionModules",
            type: "address[]"
          },
          {
            internalType: "bytes[]",
            name: "actionModulesInitDatas",
            type: "bytes[]"
          },
          { internalType: "address", name: "referenceModule", type: "address" },
          {
            internalType: "bytes",
            name: "referenceModuleInitData",
            type: "bytes"
          }
        ],
        internalType: "struct Types.QuoteParams",
        name: "quoteParams",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "quoteWithSig",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "salePrice", type: "uint256" }
    ],
    name: "royaltyInfo",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "byProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfilesToSetBlockStatus",
        type: "uint256[]"
      },
      { internalType: "bool[]", name: "blockStatus", type: "bool[]" }
    ],
    name: "setBlockStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "byProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfilesToSetBlockStatus",
        type: "uint256[]"
      },
      { internalType: "bool[]", name: "blockStatus", type: "bool[]" },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "setBlockStatusWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "newEmergencyAdmin", type: "address" }
    ],
    name: "setEmergencyAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "address", name: "followModule", type: "address" },
      { internalType: "bytes", name: "followModuleInitData", type: "bytes" }
    ],
    name: "setFollowModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "address", name: "followModule", type: "address" },
      { internalType: "bytes", name: "followModuleInitData", type: "bytes" },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "setFollowModuleWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "followTokenURIContract",
        type: "address"
      }
    ],
    name: "setFollowTokenURIContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "newGovernance", type: "address" }
    ],
    name: "setGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "migrationAdmins", type: "address[]" },
      { internalType: "bool", name: "whitelisted", type: "bool" }
    ],
    name: "setMigrationAdmins",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "string", name: "metadataURI", type: "string" }
    ],
    name: "setProfileMetadataURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "profileId", type: "uint256" },
      { internalType: "string", name: "metadataURI", type: "string" },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "setProfileMetadataURIWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "profileTokenURIContract",
        type: "address"
      }
    ],
    name: "setProfileTokenURIContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "royaltiesInBasisPoints",
        type: "uint256"
      }
    ],
    name: "setRoyalty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum Types.ProtocolState",
        name: "newState",
        type: "uint8"
      }
    ],
    name: "setState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newTreasury", type: "address" }],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint16", name: "newTreasuryFee", type: "uint16" }
    ],
    name: "setTreasuryFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenDataOf",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint96", name: "mintTimestamp", type: "uint96" }
        ],
        internalType: "struct Types.TokenData",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "transferFromKeepingDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "unfollowerProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfilesToUnfollow",
        type: "uint256[]"
      }
    ],
    name: "unfollow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "unfollowerProfileId", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "idsOfProfilesToUnfollow",
        type: "uint256[]"
      },
      {
        components: [
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint8", name: "v", type: "uint8" },
          { internalType: "bytes32", name: "r", type: "bytes32" },
          { internalType: "bytes32", name: "s", type: "bytes32" },
          { internalType: "uint256", name: "deadline", type: "uint256" }
        ],
        internalType: "struct Types.EIP712Signature",
        name: "signature",
        type: "tuple"
      }
    ],
    name: "unfollowWithSig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "profileCreator", type: "address" },
      { internalType: "bool", name: "whitelist", type: "bool" }
    ],
    name: "whitelistProfileCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
