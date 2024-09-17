export const Bridge = [
  {
    components: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "srcToken", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "erc20ForFee", type: "uint256" },
      { internalType: "uint256", name: "erc20Needed", type: "uint256" },
      { internalType: "uint256", name: "nativeNeeded", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
      { internalType: "bytes", name: "swapPath", type: "bytes" }
    ],
    internalType: "struct TokenWrapperInstructions",
    name: "wrapperInstructions",
    type: "tuple"
  },
  {
    components: [
      {
        components: [
          { internalType: "uint8", name: "swapperId", type: "uint8" },
          { internalType: "bytes", name: "swapPayload", type: "bytes" }
        ],
        internalType: "struct SwapInstructions",
        name: "preBridge",
        type: "tuple"
      },
      {
        components: [
          { internalType: "uint8", name: "swapperId", type: "uint8" },
          { internalType: "bytes", name: "swapPayload", type: "bytes" }
        ],
        internalType: "struct SwapInstructions",
        name: "postBridge",
        type: "tuple"
      },
      { internalType: "uint8", name: "bridgeId", type: "uint8" },
      { internalType: "uint256", name: "dstChainId", type: "uint256" },
      { internalType: "address", name: "target", type: "address" },
      { internalType: "address", name: "paymentOperator", type: "address" },
      { internalType: "address", name: "refund", type: "address" },
      { internalType: "bytes", name: "payload", type: "bytes" },
      { internalType: "bytes", name: "additionalArgs", type: "bytes" }
    ],
    internalType: "struct BridgeInstructions",
    name: "instructions",
    type: "tuple"
  },
  {
    components: [
      { internalType: "bytes4", name: "appId", type: "bytes4" },
      { internalType: "bytes4", name: "affiliateId", type: "bytes4" },
      { internalType: "uint256", name: "bridgeFee", type: "uint256" },
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" }
        ],
        internalType: "struct Fee[]",
        name: "appFees",
        type: "tuple[]"
      }
    ],
    internalType: "struct FeeData",
    name: "feeData",
    type: "tuple"
  },
  { internalType: "bytes", name: "signature", type: "bytes" }
] as const;
