export const RoundImplementation = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'oldMetaPtr',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'newMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'ApplicationMetaPtrUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldTime',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTime',
        type: 'uint256'
      }
    ],
    name: 'ApplicationsEndTimeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldTime',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTime',
        type: 'uint256'
      }
    ],
    name: 'ApplicationsStartTimeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'matchAmount',
        type: 'uint256'
      }
    ],
    name: 'EscrowFundsToPayoutContract',
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
        internalType: 'uint256',
        name: 'newAmount',
        type: 'uint256'
      }
    ],
    name: 'MatchAmountUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'project',
        type: 'bytes32'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'applicationMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'NewProjectApplication',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'oldMetaPtr',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'newMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'ProjectsMetaPtrUpdated',
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
        indexed: false,
        internalType: 'uint256',
        name: 'oldTime',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTime',
        type: 'uint256'
      }
    ],
    name: 'RoundEndTimeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'oldMetaPtr',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        indexed: false,
        internalType: 'struct MetaPtr',
        name: 'newMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'RoundMetaPtrUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldTime',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newTime',
        type: 'uint256'
      }
    ],
    name: 'RoundStartTimeUpdated',
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
    name: 'ROUND_OPERATOR_ROLE',
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
    name: 'applicationMetaPtr',
    outputs: [
      {
        internalType: 'uint256',
        name: 'protocol',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'pointer',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'applicationsEndTime',
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
    name: 'applicationsStartTime',
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
        internalType: 'bytes32',
        name: 'projectID',
        type: 'bytes32'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        internalType: 'struct MetaPtr',
        name: 'newApplicationMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'applyToRound',
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
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'getRoleMember',
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
    name: 'getRoleMemberCount',
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
        internalType: 'bytes',
        name: 'encodedParameters',
        type: 'bytes'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'matchAmount',
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
    name: 'payoutStrategy',
    outputs: [
      {
        internalType: 'contract IPayoutStrategy',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'projectsMetaPtr',
    outputs: [
      {
        internalType: 'uint256',
        name: 'protocol',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'pointer',
        type: 'string'
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
    inputs: [],
    name: 'roundEndTime',
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
    name: 'roundMetaPtr',
    outputs: [
      {
        internalType: 'uint256',
        name: 'protocol',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'pointer',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'roundStartTime',
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
    name: 'setReadyForPayout',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'token',
    outputs: [
      {
        internalType: 'contract IERC20',
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
        components: [
          {
            internalType: 'uint256',
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        internalType: 'struct MetaPtr',
        name: 'newApplicationMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'updateApplicationMetaPtr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newApplicationsEndTime',
        type: 'uint256'
      }
    ],
    name: 'updateApplicationsEndTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newApplicationsStartTime',
        type: 'uint256'
      }
    ],
    name: 'updateApplicationsStartTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newAmount',
        type: 'uint256'
      }
    ],
    name: 'updateMatchAmount',
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
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        internalType: 'struct MetaPtr',
        name: 'newProjectsMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'updateProjectsMetaPtr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newRoundEndTime',
        type: 'uint256'
      }
    ],
    name: 'updateRoundEndTime',
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
            name: 'protocol',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: 'pointer',
            type: 'string'
          }
        ],
        internalType: 'struct MetaPtr',
        name: 'newRoundMetaPtr',
        type: 'tuple'
      }
    ],
    name: 'updateRoundMetaPtr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newRoundStartTime',
        type: 'uint256'
      }
    ],
    name: 'updateRoundStartTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'encodedVotes',
        type: 'bytes[]'
      }
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'votingStrategy',
    outputs: [
      {
        internalType: 'contract IVotingStrategy',
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
        name: 'tokenAddress',
        type: 'address'
      },
      {
        internalType: 'address payable',
        name: 'recipent',
        type: 'address'
      }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
];
