import { LENS_NETWORK } from "../constants";
import { MainnetContracts, TestnetContracts } from "../contracts";
import LensEndpoint from "../lens-endpoints";

const getEnvConfig = (): {
  defaultCollectToken: string;
  lensApiEndpoint: string;
} => {
  switch (LENS_NETWORK) {
    case "testnet":
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        lensApiEndpoint: LensEndpoint.Testnet
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        lensApiEndpoint: LensEndpoint.Mainnet
      };
  }
};

export default getEnvConfig;
