export const EasPollActionModule = [
  {
    inputs: [
      { internalType: 'address', name: 'lensHub', type: 'address' },
      {
        internalType: 'contract IModuleRegistry',
        name: 'moduleRegistry',
        type: 'address'
      },
      { internalType: 'contract IEAS', name: 'eas', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [], name: 'AccessDenied', type: 'error' },
  { inputs: [], name: 'AttestationNotFound', type: 'error' },
  { inputs: [], name: 'GateParamsInvalid', type: 'error' },
  { inputs: [], name: 'InsufficientValue', type: 'error' },
  { inputs: [], name: 'InvalidEAS', type: 'error' },
  { inputs: [], name: 'InvalidLength', type: 'error' },
  { inputs: [], name: 'NotEnoughBalance', type: 'error' },
  { inputs: [], name: 'NotFollowing', type: 'error' },
  { inputs: [], name: 'NotHub', type: 'error' },
  { inputs: [], name: 'NotPayable', type: 'error' },
  { inputs: [], name: 'PollAlreadyExists', type: 'error' },
  { inputs: [], name: 'PollDoesNotExist', type: 'error' },
  { inputs: [], name: 'PollEnded', type: 'error' },
  { inputs: [], name: 'PollInvalid', type: 'error' },
  { inputs: [], name: 'SchemaInvalid', type: 'error' },
  { inputs: [], name: 'SchemaNotRegistered', type: 'error' },
  { inputs: [], name: 'SignatureInvalid', type: 'error' },
  { inputs: [], name: 'VoteInvalid', type: 'error' },
  { inputs: [], name: 'VoteNotFound', type: 'error' },
  { inputs: [], name: 'VotedAlready', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'bytes32[4]', name: 'options', type: 'bytes32[4]' },
          { internalType: 'bool', name: 'followersOnly', type: 'bool' },
          { internalType: 'uint40', name: 'endTimestamp', type: 'uint40' },
          { internalType: 'bool', name: 'signatureRequired', type: 'bool' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
              },
              { internalType: 'uint256', name: 'minThreshold', type: 'uint256' }
            ],
            internalType: 'struct TokenGateLib.GateParams',
            name: 'gateParams',
            type: 'tuple'
          }
        ],
        indexed: false,
        internalType: 'struct EasPollActionModule.Poll',
        name: 'poll',
        type: 'tuple'
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'publicationProfileId',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'publicationId',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'actorProfileId',
                type: 'uint256'
              },
              {
                internalType: 'address',
                name: 'actorProfileOwner',
                type: 'address'
              },
              {
                internalType: 'address',
                name: 'transactionExecutor',
                type: 'address'
              },
              { internalType: 'uint8', name: 'optionIndex', type: 'uint8' },
              { internalType: 'uint40', name: 'timestamp', type: 'uint40' }
            ],
            internalType: 'struct EasPollActionModule.Vote',
            name: 'vote',
            type: 'tuple'
          },
          { internalType: 'bytes32', name: 'attestationUid', type: 'bytes32' }
        ],
        indexed: false,
        internalType: 'struct EasPollActionModule.AttestedVote',
        name: 'attestedVote',
        type: 'tuple'
      }
    ],
    name: 'AttestationCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'attestationUid',
        type: 'bytes32'
      }
    ],
    name: 'AttestationRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'bytes32[4]', name: 'options', type: 'bytes32[4]' },
          { internalType: 'bool', name: 'followersOnly', type: 'bool' },
          { internalType: 'uint40', name: 'endTimestamp', type: 'uint40' },
          { internalType: 'bool', name: 'signatureRequired', type: 'bool' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
              },
              { internalType: 'uint256', name: 'minThreshold', type: 'uint256' }
            ],
            internalType: 'struct TokenGateLib.GateParams',
            name: 'gateParams',
            type: 'tuple'
          }
        ],
        indexed: false,
        internalType: 'struct EasPollActionModule.Poll',
        name: 'poll',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationProfileId',
            type: 'uint256'
          },
          { internalType: 'uint256', name: 'publicationId', type: 'uint256' },
          { internalType: 'uint256', name: 'actorProfileId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address'
          },
          { internalType: 'uint8', name: 'optionIndex', type: 'uint8' },
          { internalType: 'uint40', name: 'timestamp', type: 'uint40' }
        ],
        indexed: false,
        internalType: 'struct EasPollActionModule.Vote',
        name: 'vote',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'attestationUid',
        type: 'bytes32'
      }
    ],
    name: 'AttestationValidated',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'ModuleRegistered', type: 'event' },
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
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'pubId',
        type: 'uint256'
      },
      {
        components: [
          { internalType: 'bytes32[4]', name: 'options', type: 'bytes32[4]' },
          { internalType: 'bool', name: 'followersOnly', type: 'bool' },
          { internalType: 'uint40', name: 'endTimestamp', type: 'uint40' },
          { internalType: 'bool', name: 'signatureRequired', type: 'bool' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
              },
              { internalType: 'uint256', name: 'minThreshold', type: 'uint256' }
            ],
            internalType: 'struct TokenGateLib.GateParams',
            name: 'gateParams',
            type: 'tuple'
          }
        ],
        indexed: false,
        internalType: 'struct EasPollActionModule.Poll',
        name: 'poll',
        type: 'tuple'
      }
    ],
    name: 'PollCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          {
            internalType: 'contract ISchemaResolver',
            name: 'resolver',
            type: 'address'
          },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'string', name: 'schema', type: 'string' }
        ],
        indexed: false,
        internalType: 'struct SchemaRecord',
        name: 'schemaRecord',
        type: 'tuple'
      }
    ],
    name: 'SchemaRegistered',
    type: 'event'
  },
  {
    inputs: [],
    name: 'HUB',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MODULE_REGISTRY',
    outputs: [
      { internalType: 'contract IModuleRegistry', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SCHEMA',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          { internalType: 'bytes32', name: 'schema', type: 'bytes32' },
          { internalType: 'uint64', name: 'time', type: 'uint64' },
          { internalType: 'uint64', name: 'expirationTime', type: 'uint64' },
          { internalType: 'uint64', name: 'revocationTime', type: 'uint64' },
          { internalType: 'bytes32', name: 'refUID', type: 'bytes32' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct Attestation',
        name: 'attestation',
        type: 'tuple'
      }
    ],
    name: 'attest',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: 'actor', type: 'address' }
    ],
    name: 'getAttestation',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          { internalType: 'bytes32', name: 'schema', type: 'bytes32' },
          { internalType: 'uint64', name: 'time', type: 'uint64' },
          { internalType: 'uint64', name: 'expirationTime', type: 'uint64' },
          { internalType: 'uint64', name: 'revocationTime', type: 'uint64' },
          { internalType: 'bytes32', name: 'refUID', type: 'bytes32' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct Attestation',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'uint256', name: 'index', type: 'uint256' }
    ],
    name: 'getAttestationByIndex',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' }
    ],
    name: 'getAttestationCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: 'actor', type: 'address' }
    ],
    name: 'getAttestationUid',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getModuleMetadataURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' }
    ],
    name: 'getPoll',
    outputs: [
      {
        components: [
          { internalType: 'bytes32[4]', name: 'options', type: 'bytes32[4]' },
          { internalType: 'bool', name: 'followersOnly', type: 'bool' },
          { internalType: 'uint40', name: 'endTimestamp', type: 'uint40' },
          { internalType: 'bool', name: 'signatureRequired', type: 'bool' },
          {
            components: [
              {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
              },
              { internalType: 'uint256', name: 'minThreshold', type: 'uint256' }
            ],
            internalType: 'struct TokenGateLib.GateParams',
            name: 'gateParams',
            type: 'tuple'
          }
        ],
        internalType: 'struct EasPollActionModule.Poll',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getSchemaRecord',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          {
            internalType: 'contract ISchemaResolver',
            name: 'resolver',
            type: 'address'
          },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'string', name: 'schema', type: 'string' }
        ],
        internalType: 'struct SchemaRecord',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: 'actor', type: 'address' }
    ],
    name: 'getVote',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationProfileId',
            type: 'uint256'
          },
          { internalType: 'uint256', name: 'publicationId', type: 'uint256' },
          { internalType: 'uint256', name: 'actorProfileId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address'
          },
          { internalType: 'uint8', name: 'optionIndex', type: 'uint8' },
          { internalType: 'uint40', name: 'timestamp', type: 'uint40' }
        ],
        internalType: 'struct EasPollActionModule.Vote',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'uint256', name: 'index', type: 'uint256' }
    ],
    name: 'getVoteByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationProfileId',
            type: 'uint256'
          },
          { internalType: 'uint256', name: 'publicationId', type: 'uint256' },
          { internalType: 'uint256', name: 'actorProfileId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address'
          },
          { internalType: 'uint8', name: 'optionIndex', type: 'uint8' },
          { internalType: 'uint40', name: 'timestamp', type: 'uint40' }
        ],
        internalType: 'struct EasPollActionModule.Vote',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'initializePublicationAction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isPayable',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isRegistered',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          { internalType: 'bytes32', name: 'schema', type: 'bytes32' },
          { internalType: 'uint64', name: 'time', type: 'uint64' },
          { internalType: 'uint64', name: 'expirationTime', type: 'uint64' },
          { internalType: 'uint64', name: 'revocationTime', type: 'uint64' },
          { internalType: 'bytes32', name: 'refUID', type: 'bytes32' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct Attestation[]',
        name: 'attestations',
        type: 'tuple[]'
      },
      { internalType: 'uint256[]', name: 'values', type: 'uint256[]' }
    ],
    name: 'multiAttest',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          { internalType: 'bytes32', name: 'schema', type: 'bytes32' },
          { internalType: 'uint64', name: 'time', type: 'uint64' },
          { internalType: 'uint64', name: 'expirationTime', type: 'uint64' },
          { internalType: 'uint64', name: 'revocationTime', type: 'uint64' },
          { internalType: 'bytes32', name: 'refUID', type: 'bytes32' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct Attestation[]',
        name: 'attestations',
        type: 'tuple[]'
      },
      { internalType: 'uint256[]', name: 'values', type: 'uint256[]' }
    ],
    name: 'multiRevoke',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationActedProfileId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'publicationActedId',
            type: 'uint256'
          },
          { internalType: 'uint256', name: 'actorProfileId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address'
          },
          {
            internalType: 'uint256[]',
            name: 'referrerProfileIds',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'referrerPubIds',
            type: 'uint256[]'
          },
          {
            internalType: 'enum Types.PublicationType[]',
            name: 'referrerPubTypes',
            type: 'uint8[]'
          },
          { internalType: 'bytes', name: 'actionModuleData', type: 'bytes' }
        ],
        internalType: 'struct Types.ProcessActionParams',
        name: 'processActionParams',
        type: 'tuple'
      }
    ],
    name: 'processPublicationAction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'registerModule',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'registerSchema',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
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
        components: [
          { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
          { internalType: 'bytes32', name: 'schema', type: 'bytes32' },
          { internalType: 'uint64', name: 'time', type: 'uint64' },
          { internalType: 'uint64', name: 'expirationTime', type: 'uint64' },
          { internalType: 'uint64', name: 'revocationTime', type: 'uint64' },
          { internalType: 'bytes32', name: 'refUID', type: 'bytes32' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'bool', name: 'revocable', type: 'bool' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct Attestation',
        name: 'attestation',
        type: 'tuple'
      }
    ],
    name: 'revoke',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'schemaUid',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'string', name: '_metadataURI', type: 'string' }],
    name: 'setModuleMetadataURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_schemaUid', type: 'bytes32' }],
    name: 'setSchemaUid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  { stateMutability: 'payable', type: 'receive' }
] as const;
