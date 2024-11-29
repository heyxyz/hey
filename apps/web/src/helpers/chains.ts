import { defineChain } from "viem";

export const lensTestnet = defineChain({
  id: 37_111,
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: { name: "GRASS", symbol: "GRASS", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.lens.dev"]
    }
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://block-explorer.testnet.lens.dev",
      apiUrl: "https://block-explorer-api.testnet.lens.dev"
    }
  },
  contracts: {
    multicall3: {
      address: "0x8A44EDE8a6843a997bC0Cc4659e4dB1Da8f91116",
      blockCreated: 22325
    }
  },
  testnet: true
});
