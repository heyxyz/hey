import { LENS_TESTNET_RPCS } from "@hey/data/rpcs";
import type { FallbackTransport } from "viem";
import { fallback, http } from "viem";

const getRpc = ({ mainnet }: { mainnet: boolean }): FallbackTransport => {
  if (mainnet) {
    return fallback(LENS_TESTNET_RPCS.map((rpc) => http(rpc)));
  }

  return fallback(LENS_TESTNET_RPCS.map((rpc) => http(rpc)));
};

export default getRpc;
