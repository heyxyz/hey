export const resolverAbi = [
  {
    inputs: [{ internalType: "contract ENS", name: "_ens", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      { internalType: "address[]", name: "addresses", type: "address[]" }
    ],
    name: "getNames",
    outputs: [{ internalType: "string[]", name: "r", type: "string[]" }],
    stateMutability: "view",
    type: "function"
  }
];
