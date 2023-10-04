export const ZoraERC721Drop = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_zoraERC721TransferHelper',
        type: 'address'
      },
      {
        internalType: 'contract IFactoryUpgradeGate',
        name: '_factoryUpgradeGate',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_marketFilterDAOAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_mintFeeAmount',
        type: 'uint256'
      },
      {
        internalType: 'address payable',
        name: '_mintFeeRecipient',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_protocolRewards',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'Access_MissingRoleOrAdmin',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Access_OnlyAdmin',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Access_WithdrawNotAllowed',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposedAddress',
        type: 'address'
      }
    ],
    name: 'Admin_InvalidUpgradeAddress',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Admin_UnableToFinalizeNotOpenEdition',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ApprovalCallerNotOwnerNorApproved',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ApprovalQueryForNonexistentToken',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ApprovalToCurrentOwner',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ApproveToCaller',
    type: 'error'
  },
  {
    inputs: [],
    name: 'BalanceQueryForZeroAddress',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CREATOR_FUNDS_RECIPIENT_NOT_SET',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ExternalMetadataRenderer_CallFailed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INVALID_ADDRESS_ZERO',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INVALID_ETH_AMOUNT',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidMintSchedule',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MarketFilterDAOAddressNotSupportedForChain',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MintFee_FundsSendFailure',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MintToZeroAddress',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MintZeroQuantity',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Mint_SoldOut',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ONLY_CREATE_REFERRAL',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ONLY_OWNER',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ONLY_PENDING_OWNER',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'OperatorNotAllowed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OwnerQueryForNonexistentToken',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Presale_Inactive',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Presale_MerkleNotApproved',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Presale_TooManyForAddress',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ProtocolRewards_WithdrawSendFailure',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Purchase_TooManyForAddress',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'correctPrice',
        type: 'uint256'
      }
    ],
    name: 'Purchase_WrongPrice',
    type: 'error'
  },
  {
    inputs: [],
    name: 'RemoteOperatorFilterRegistryCallFailed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Sale_Inactive',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'maxRoyaltyBPS',
        type: 'uint16'
      }
    ],
    name: 'Setup_RoyaltyPercentageTooHigh',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TransferCallerNotOwnerNorApproved',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TransferFromIncorrectOwner',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TransferToNonERC721ReceiverImplementer',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TransferToZeroAddress',
    type: 'error'
  },
  {
    inputs: [],
    name: 'URIQueryForNonexistentToken',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Withdraw_FundsSendFailure',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fromTokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_toTokenId',
        type: 'uint256'
      }
    ],
    name: 'BatchMetadataUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address'
      }
    ],
    name: 'BeaconUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'source',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'FundsReceived',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newAddress',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'changedBy',
        type: 'address'
      }
    ],
    name: 'FundsRecipientChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawnBy',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawnTo',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeRecipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256'
      }
    ],
    name: 'FundsWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'MetadataUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'comment',
        type: 'string'
      }
    ],
    name: 'MintComment',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mintFeeAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'mintFeeRecipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'MintFeePayout',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numberOfMints',
        type: 'uint256'
      }
    ],
    name: 'OpenMintFinalized',
    type: 'event'
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
        name: 'potentialNewOwner',
        type: 'address'
      }
    ],
    name: 'OwnerCanceled',
    type: 'event'
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
        name: 'potentialNewOwner',
        type: 'address'
      }
    ],
    name: 'OwnerPending',
    type: 'event'
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32'
      }
    ],
    name: 'RoleAdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'firstPurchasedTokenId',
        type: 'uint256'
      }
    ],
    name: 'Sale',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'changedBy',
        type: 'address'
      }
    ],
    name: 'SalesConfigChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'contract IMetadataRenderer',
        name: 'renderer',
        type: 'address'
      }
    ],
    name: 'UpdatedMetadataRenderer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SALES_MANAGER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      }
    ],
    name: 'adminMint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'recipients',
        type: 'address[]'
      }
    ],
    name: 'adminMintAirdrop',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'callMetadataRenderer',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numTokens',
        type: 'uint256'
      }
    ],
    name: 'computeFreeMintRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'creatorReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createReferralReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'mintReferralReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'firstMinterReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'zoraReward',
            type: 'uint256'
          }
        ],
        internalType: 'struct RewardsSettings',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numTokens',
        type: 'uint256'
      }
    ],
    name: 'computePaidMintRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'creatorReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createReferralReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'mintReferralReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'firstMinterReward',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'zoraReward',
            type: 'uint256'
          }
        ],
        internalType: 'struct RewardsSettings',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numTokens',
        type: 'uint256'
      }
    ],
    name: 'computeTotalReward',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'config',
    outputs: [
      {
        internalType: 'contract IMetadataRenderer',
        name: 'metadataRenderer',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'editionSize',
        type: 'uint64'
      },
      {
        internalType: 'uint16',
        name: 'royaltyBPS',
        type: 'uint16'
      },
      {
        internalType: 'address payable',
        name: 'fundsRecipient',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'contractVersion',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'createReferral',
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
    name: 'factoryUpgradeGate',
    outputs: [
      {
        internalType: 'contract IFactoryUpgradeGate',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'finalizeOpenEdition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'getApproved',
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
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_contractName',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_contractSymbol',
        type: 'string'
      },
      {
        internalType: 'address',
        name: '_initialOwner',
        type: 'address'
      },
      {
        internalType: 'address payable',
        name: '_fundsRecipient',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: '_editionSize',
        type: 'uint64'
      },
      {
        internalType: 'uint16',
        name: '_royaltyBPS',
        type: 'uint16'
      },
      {
        internalType: 'bytes[]',
        name: '_setupCalls',
        type: 'bytes[]'
      },
      {
        internalType: 'contract IMetadataRenderer',
        name: '_metadataRenderer',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: '_metadataRendererInit',
        type: 'bytes'
      },
      {
        internalType: 'address',
        name: '_createReferral',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'isAdmin',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftOwner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'enable',
        type: 'bool'
      }
    ],
    name: 'manageMarketFilterDAOSubscription',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'marketFilterDAOAddress',
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
    name: 'metadataRenderer',
    outputs: [
      {
        internalType: 'contract IMetadataRenderer',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'comment',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'mintReferral',
        type: 'address'
      }
    ],
    name: 'mintWithRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: 'minter',
        type: 'address'
      }
    ],
    name: 'mintedPerAddress',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'totalMints',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'presaleMints',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'publicMints',
            type: 'uint256'
          }
        ],
        internalType: 'struct IERC721Drop.AddressMintDetails',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]'
      }
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
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
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'presaleMintsByAddress',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      }
    ],
    name: 'purchase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'maxQuantity',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256'
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProof',
        type: 'bytes32[]'
      }
    ],
    name: 'purchasePresale',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'maxQuantity',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256'
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProof',
        type: 'bytes32[]'
      },
      {
        internalType: 'string',
        name: 'comment',
        type: 'string'
      }
    ],
    name: 'purchasePresaleWithComment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'maxQuantity',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256'
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProof',
        type: 'bytes32[]'
      },
      {
        internalType: 'string',
        name: 'comment',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'mintReferral',
        type: 'address'
      }
    ],
    name: 'purchasePresaleWithRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'comment',
        type: 'string'
      }
    ],
    name: 'purchaseWithComment',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'comment',
        type: 'string'
      }
    ],
    name: 'purchaseWithRecipient',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_salePrice',
        type: 'uint256'
      }
    ],
    name: 'royaltyInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'royaltyAmount',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'royaltyMintSchedule',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'saleDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'publicSaleActive',
            type: 'bool'
          },
          {
            internalType: 'bool',
            name: 'presaleActive',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'publicSalePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint64',
            name: 'publicSaleStart',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'publicSaleEnd',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'presaleStart',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'presaleEnd',
            type: 'uint64'
          },
          {
            internalType: 'bytes32',
            name: 'presaleMerkleRoot',
            type: 'bytes32'
          },
          {
            internalType: 'uint256',
            name: 'maxSalePurchasePerAddress',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalMinted',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256'
          }
        ],
        internalType: 'struct IERC721Drop.SaleDetails',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'salesConfig',
    outputs: [
      {
        internalType: 'uint104',
        name: 'publicSalePrice',
        type: 'uint104'
      },
      {
        internalType: 'uint32',
        name: 'maxSalePurchasePerAddress',
        type: 'uint32'
      },
      {
        internalType: 'uint64',
        name: 'publicSaleStart',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'publicSaleEnd',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'presaleStart',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'presaleEnd',
        type: 'uint64'
      },
      {
        internalType: 'bytes32',
        name: 'presaleMerkleRoot',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'newRecipientAddress',
        type: 'address'
      }
    ],
    name: 'setFundsRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IMetadataRenderer',
        name: 'newRenderer',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'setupRenderer',
        type: 'bytes'
      }
    ],
    name: 'setMetadataRenderer',
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
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint104',
        name: 'publicSalePrice',
        type: 'uint104'
      },
      {
        internalType: 'uint32',
        name: 'maxSalePurchasePerAddress',
        type: 'uint32'
      },
      {
        internalType: 'uint64',
        name: 'publicSaleStart',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'publicSaleEnd',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'presaleStart',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'presaleEnd',
        type: 'uint64'
      },
      {
        internalType: 'bytes32',
        name: 'presaleMerkleRoot',
        type: 'bytes32'
      }
    ],
    name: 'setSaleConfiguration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      }
    ],
    name: 'updateCreateReferral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'args',
        type: 'bytes'
      }
    ],
    name: 'updateMarketFilterSettings',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'newSchedule',
        type: 'uint32'
      }
    ],
    name: 'updateRoyaltyMintSchedule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'zoraERC721TransferHelper',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      }
    ],
    name: 'zoraFeeForAmount',
    outputs: [
      {
        internalType: 'address payable',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
];
