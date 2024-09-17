import { IS_MAINNET } from "./constants";

export const VerifiedOpenActionModules = {
  DecentNFT: IS_MAINNET
    ? "0x028f6aeE3CF9e1cA725f4C47d9460801b6c7508A"
    : "0xe310b5Ed0B3c19B1F0852Ce985a4C38BAE738FDb"
};
