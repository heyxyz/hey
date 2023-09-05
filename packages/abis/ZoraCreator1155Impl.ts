export const ZoraCreator1155Impl = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_mintFeeAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_mintFeeRecipient',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_factory',
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
    inputs: [],
    name: 'ADDRESS_DELEGATECALL_TO_NON_CONTRACT',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ADDRESS_LOW_LEVEL_CALL_FAILED',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'Burn_NotOwnerOrApproved',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CREATOR_FUNDS_RECIPIENT_NOT_SET',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'reason',
        type: 'bytes'
      }
    ],
    name: 'CallFailed',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
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
    name: 'CannotMintMoreTokens',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'mintFeeRecipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'mintFee',
        type: 'uint256'
      }
    ],
    name: 'CannotSendMintFee',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CannotSetMintFeeToZeroAddress',
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
    name: 'Config_TransferHookNotSupported',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_ACCOUNTS_AND_IDS_LENGTH_MISMATCH',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_ADDRESS_ZERO_IS_NOT_A_VALID_OWNER',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_BURN_AMOUNT_EXCEEDS_BALANCE',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_BURN_FROM_ZERO_ADDRESS',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_CALLER_IS_NOT_TOKEN_OWNER_OR_APPROVED',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_ERC1155RECEIVER_REJECTED_TOKENS',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_IDS_AND_AMOUNTS_LENGTH_MISMATCH',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_INSUFFICIENT_BALANCE_FOR_TRANSFER',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_MINT_TO_ZERO_ADDRESS',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_SETTING_APPROVAL_FOR_SELF',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_TRANSFER_TO_NON_ERC1155RECEIVER_IMPLEMENTER',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1155_TRANSFER_TO_ZERO_ADDRESS',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1967_NEW_IMPL_NOT_CONTRACT',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1967_NEW_IMPL_NOT_UUPS',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1967_UNSUPPORTED_PROXIABLEUUID',
    type: 'error'
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
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'ETHWithdrawFailed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FUNCTION_MUST_BE_CALLED_THROUGH_ACTIVE_PROXY',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FUNCTION_MUST_BE_CALLED_THROUGH_DELEGATECALL',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'contractValue',
        type: 'uint256'
      }
    ],
    name: 'FundsWithdrawInsolvent',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INITIALIZABLE_CONTRACT_ALREADY_INITIALIZED',
    type: 'error'
  },
  {
    inputs: [],
    name: 'INITIALIZABLE_CONTRACT_IS_NOT_INITIALIZING',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'mintFeeBPS',
        type: 'uint256'
      }
    ],
    name: 'MintFeeCannotBeMoreThanZeroPointOneETH',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Mint_InsolventSaleTransfer',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Mint_TokenIDMintNotAllowed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Mint_UnknownCommand',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Mint_ValueTransferFail',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NewOwnerNeedsToBeAdmin',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'NoRendererForToken',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ONLY_CREATE_REFERRAL',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'ProtocolRewardsWithdrawFailed',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'renderer',
        type: 'address'
      }
    ],
    name: 'RendererNotValid',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Renderer_NotValidRendererContract',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'targetContract',
        type: 'address'
      }
    ],
    name: 'Sale_CannotCallNonSalesContract',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'expected',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'actual',
        type: 'uint256'
      }
    ],
    name: 'TokenIdMismatch',
    type: 'error'
  },
  {
    inputs: [],
    name: 'UUPS_UPGRADEABLE_MUST_NOT_BE_CALLED_THROUGH_DELEGATECALL',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'role',
        type: 'uint256'
      }
    ],
    name: 'UserMissingRoleForToken',
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
        name: 'account',
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
        name: 'updater',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'enum IZoraCreator1155.ConfigUpdate',
        name: 'updateType',
        type: 'uint8'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address'
          },
          {
            internalType: 'uint96',
            name: '__gap1',
            type: 'uint96'
          },
          {
            internalType: 'address payable',
            name: 'fundsRecipient',
            type: 'address'
          },
          {
            internalType: 'uint96',
            name: '__gap2',
            type: 'uint96'
          },
          {
            internalType: 'contract ITransferHookReceiver',
            name: 'transferHook',
            type: 'address'
          },
          {
            internalType: 'uint96',
            name: '__gap3',
            type: 'uint96'
          }
        ],
        indexed: false,
        internalType: 'struct IZoraCreator1155TypesV1.ContractConfig',
        name: 'newConfig',
        type: 'tuple'
      }
    ],
    name: 'ConfigUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'updater',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    name: 'ContractMetadataUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IRenderer1155',
        name: 'renderer',
        type: 'address'
      }
    ],
    name: 'ContractRendererUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'lastOwner',
        type: 'address'
      },
      {
        indexed: false,
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
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'minter',
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
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Purchased',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'renderer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'RendererUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'newURI',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'maxSupply',
        type: 'uint256'
      }
    ],
    name: 'SetupNewToken',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
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
        indexed: false,
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'TransferBatch',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
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
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'TransferSingle',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'value',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'URI',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'permissions',
        type: 'uint256'
      }
    ],
    name: 'UpdatedPermissions',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32'
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address'
          }
        ],
        indexed: false,
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'configuration',
        type: 'tuple'
      }
    ],
    name: 'UpdatedRoyalties',
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
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'uri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalMinted',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct IZoraCreator1155TypesV1.TokenData',
        name: 'tokenData',
        type: 'tuple'
      }
    ],
    name: 'UpdatedToken',
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
    name: 'CONTRACT_BASE_ID',
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
    name: 'PERMISSION_BIT_ADMIN',
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
    name: 'PERMISSION_BIT_FUNDS_MANAGER',
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
    name: 'PERMISSION_BIT_METADATA',
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
    name: 'PERMISSION_BIT_MINTER',
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
    name: 'PERMISSION_BIT_SALES',
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
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'permissionBits',
        type: 'uint256'
      }
    ],
    name: 'addPermission',
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
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'adminMint',
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
      },
      {
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'quantities',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'adminMintBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lastTokenId',
        type: 'uint256'
      }
    ],
    name: 'assumeLastTokenIdMatches',
    outputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
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
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      }
    ],
    name: 'balanceOfBatch',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'batchBalances',
        type: 'uint256[]'
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
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      }
    ],
    name: 'burnBatch',
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
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'callRenderer',
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
      },
      {
        internalType: 'contract IMinter1155',
        name: 'salesConfig',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'callSale',
    outputs: [],
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
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'uint96',
        name: '__gap1',
        type: 'uint96'
      },
      {
        internalType: 'address payable',
        name: 'fundsRecipient',
        type: 'address'
      },
      {
        internalType: 'uint96',
        name: '__gap2',
        type: 'uint96'
      },
      {
        internalType: 'contract ITransferHookReceiver',
        name: 'transferHook',
        type: 'address'
      },
      {
        internalType: 'uint96',
        name: '__gap3',
        type: 'uint96'
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
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'createReferrals',
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
        name: '',
        type: 'uint256'
      }
    ],
    name: 'customRenderers',
    outputs: [
      {
        internalType: 'contract IRenderer1155',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCreatorRewardRecipient',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'getCustomRenderer',
    outputs: [
      {
        internalType: 'contract IRenderer1155',
        name: 'customRenderer',
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
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPermissions',
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
    name: 'getRoyalties',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32'
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address'
          }
        ],
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
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
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'getTokenInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'uri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalMinted',
            type: 'uint256'
          }
        ],
        internalType: 'struct IZoraCreator1155TypesV1.TokenData',
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
        internalType: 'string',
        name: 'contractName',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'newContractURI',
        type: 'string'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32'
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address'
          }
        ],
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'defaultRoyaltyConfiguration',
        type: 'tuple'
      },
      {
        internalType: 'address payable',
        name: 'defaultAdmin',
        type: 'address'
      },
      {
        internalType: 'bytes[]',
        name: 'setupActions',
        type: 'bytes[]'
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
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'role',
        type: 'uint256'
      }
    ],
    name: 'isAdminOrRole',
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
        name: 'account',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'metadataRendererContract',
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
        internalType: 'contract IMinter1155',
        name: 'minter',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'minterArguments',
        type: 'bytes'
      }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mintFee',
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
    name: 'mintFeeRecipient',
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
        internalType: 'contract IMinter1155',
        name: 'minter',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'minterArguments',
        type: 'bytes'
      },
      {
        internalType: 'address',
        name: 'mintReferral',
        type: 'address'
      }
    ],
    name: 'mintWithRewards',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'nextTokenId',
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
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'permissions',
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
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'permissionBits',
        type: 'uint256'
      }
    ],
    name: 'removePermission',
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
      }
    ],
    name: 'royalties',
    outputs: [
      {
        internalType: 'uint32',
        name: 'royaltyMintSchedule',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: 'royaltyBPS',
        type: 'uint32'
      },
      {
        internalType: 'address',
        name: 'royaltyRecipient',
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
      },
      {
        internalType: 'uint256',
        name: 'salePrice',
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
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'safeBatchTransferFrom',
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
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
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
        name: 'fundsRecipient',
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
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'contract IRenderer1155',
        name: 'renderer',
        type: 'address'
      }
    ],
    name: 'setTokenMetadataRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract ITransferHookReceiver',
        name: 'transferHook',
        type: 'address'
      }
    ],
    name: 'setTransferHook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'newURI',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'maxSupply',
        type: 'uint256'
      }
    ],
    name: 'setupNewToken',
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
        internalType: 'string',
        name: 'newURI',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'maxSupply',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'createReferral',
        type: 'address'
      }
    ],
    name: 'setupNewTokenWithCreateReferral',
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
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalSupply',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'mintAmount',
        type: 'uint256'
      }
    ],
    name: 'supplyRoyaltyInfo',
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
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newURI',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_newName',
        type: 'string'
      }
    ],
    name: 'updateContractMetadata',
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
      },
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
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32'
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address'
          }
        ],
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'newConfiguration',
        type: 'tuple'
      }
    ],
    name: 'updateRoyaltiesForToken',
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
      },
      {
        internalType: 'string',
        name: '_newURI',
        type: 'string'
      }
    ],
    name: 'updateTokenURI',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'uri',
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
  }
];
