export const Permit2 = [
  {
    inputs: [],
    name: "AllowanceExpired",
    type: "error"
  },
  {
    inputs: [],
    name: "ExcessiveInvalidation",
    type: "error"
  },
  {
    inputs: [],
    name: "InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidContractSignature",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidNonce",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidSignature",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidSigner",
    type: "error"
  },
  {
    inputs: [],
    name: "LengthMismatch",
    type: "error"
  },
  {
    inputs: [],
    name: "NotSpender",
    type: "error"
  },
  {
    inputs: [],
    name: "SignatureExpired",
    type: "error"
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
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "amount",
        type: "uint160"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "expiration",
        type: "uint48"
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
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "Lockdown",
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
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "newNonce",
        type: "uint48"
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "oldNonce",
        type: "uint48"
      }
    ],
    name: "NonceInvalidation",
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
        indexed: false,
        internalType: "uint256",
        name: "word",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mask",
        type: "uint256"
      }
    ],
    name: "UnorderedNonceInvalidation",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint160",
        name: "amount",
        type: "uint160"
      },
      {
        internalType: "uint48",
        name: "expiration",
        type: "uint48"
      },
      {
        internalType: "uint48",
        name: "nonce",
        type: "uint48"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint160",
        name: "amount",
        type: "uint160"
      },
      {
        internalType: "uint48",
        name: "expiration",
        type: "uint48"
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
        name: "token",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint48",
        name: "newNonce",
        type: "uint48"
      }
    ],
    name: "invalidateNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "wordPos",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mask",
        type: "uint256"
      }
    ],
    name: "invalidateUnorderedNonces",
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
            name: "token",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        internalType: "struct IAllowanceTransfer.TokenSpenderPair[]",
        name: "approvals",
        type: "tuple[]"
      }
    ],
    name: "lockdown",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "nonceBitmap",
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
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "token",
                type: "address"
              },
              {
                internalType: "uint160",
                name: "amount",
                type: "uint160"
              },
              {
                internalType: "uint48",
                name: "expiration",
                type: "uint48"
              },
              {
                internalType: "uint48",
                name: "nonce",
                type: "uint48"
              }
            ],
            internalType: "struct IAllowanceTransfer.PermitDetails[]",
            name: "details",
            type: "tuple[]"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "sigDeadline",
            type: "uint256"
          }
        ],
        internalType: "struct IAllowanceTransfer.PermitBatch",
        name: "permitBatch",
        type: "tuple"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "permit",
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
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "token",
                type: "address"
              },
              {
                internalType: "uint160",
                name: "amount",
                type: "uint160"
              },
              {
                internalType: "uint48",
                name: "expiration",
                type: "uint48"
              },
              {
                internalType: "uint48",
                name: "nonce",
                type: "uint48"
              }
            ],
            internalType: "struct IAllowanceTransfer.PermitDetails",
            name: "details",
            type: "tuple"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "sigDeadline",
            type: "uint256"
          }
        ],
        internalType: "struct IAllowanceTransfer.PermitSingle",
        name: "permitSingle",
        type: "tuple"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "permit",
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
                name: "token",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions[]",
            name: "permitted",
            type: "tuple[]"
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
          }
        ],
        internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "requestedAmount",
            type: "uint256"
          }
        ],
        internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
        name: "transferDetails",
        type: "tuple[]"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "permitTransferFrom",
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
                name: "token",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions",
            name: "permitted",
            type: "tuple"
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
          }
        ],
        internalType: "struct ISignatureTransfer.PermitTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "requestedAmount",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "permitTransferFrom",
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
                name: "token",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions",
            name: "permitted",
            type: "tuple"
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
          }
        ],
        internalType: "struct ISignatureTransfer.PermitTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "requestedAmount",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "witness",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "witnessTypeName",
        type: "string"
      },
      {
        internalType: "string",
        name: "witnessType",
        type: "string"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "permitWitnessTransferFrom",
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
                name: "token",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              }
            ],
            internalType: "struct ISignatureTransfer.TokenPermissions[]",
            name: "permitted",
            type: "tuple[]"
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
          }
        ],
        internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
        name: "permit",
        type: "tuple"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "requestedAmount",
            type: "uint256"
          }
        ],
        internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
        name: "transferDetails",
        type: "tuple[]"
      },
      {
        internalType: "bytes32",
        name: "witness",
        type: "bytes32"
      },
      {
        internalType: "string",
        name: "witnessTypeName",
        type: "string"
      },
      {
        internalType: "string",
        name: "witnessType",
        type: "string"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "permitWitnessTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
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
        internalType: "uint160",
        name: "amount",
        type: "uint160"
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
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address"
          },
          {
            internalType: "uint160",
            name: "amount",
            type: "uint160"
          },
          {
            internalType: "address",
            name: "to",
            type: "address"
          }
        ],
        internalType: "struct IAllowanceTransfer.AllowanceTransferDetails[]",
        name: "transferDetails",
        type: "tuple[]"
      }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
