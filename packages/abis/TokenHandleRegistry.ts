export const TokenHandleRegistry = [
  {
    inputs: [
      { internalType: "uint256", name: "handleId", type: "uint256" },
      { internalType: "uint256", name: "profileId", type: "uint256" }
    ],
    name: "link",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "handleId", type: "uint256" },
      { internalType: "uint256", name: "profileId", type: "uint256" }
    ],
    name: "unlink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
