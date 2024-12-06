import { IS_MAINNET } from "@hey/data/constants";
import { chains } from "@lens-network/sdk/viem";

export const CHAIN = IS_MAINNET ? chains.testnet : chains.testnet;
