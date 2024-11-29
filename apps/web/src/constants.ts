import { lensTestnet } from "@helpers/chains";
import { IS_MAINNET } from "@hey/data/constants";
import { polygon } from "wagmi/chains";

export const CHAIN = IS_MAINNET ? polygon : lensTestnet;
