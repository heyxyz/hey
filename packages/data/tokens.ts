import { IS_MAINNET } from "./constants";
import { MainnetContracts, TestnetContracts } from "./contracts";

const mainnetTokens = [
  {
    name: "Wrapped Grass",
    symbol: "WGRASS",
    decimals: 18,
    contractAddress: MainnetContracts.DefaultToken
  }
];

const testnetTokens = [
  {
    name: "Wrapped Grass",
    symbol: "WGRASS",
    decimals: 18,
    contractAddress: TestnetContracts.DefaultToken
  }
];

export const tokens = IS_MAINNET ? mainnetTokens : testnetTokens;
