import { LENS_NETWORK } from "../constants";
import { MainnetContracts, TestnetContracts } from "../contracts";
import LensEndpoint from "../lens-endpoints";

const getEnvConfig = (): {
  defaultCollectToken: string;
  lensApiEndpoint: string;
  appAddress: string;
  sponsorAddress: string;
} => {
  switch (LENS_NETWORK) {
    case "testnet":
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        lensApiEndpoint: LensEndpoint.Testnet,
        appAddress: TestnetContracts.App,
        sponsorAddress: TestnetContracts.Sponsor
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        lensApiEndpoint: LensEndpoint.Mainnet,
        appAddress: MainnetContracts.App,
        sponsorAddress: MainnetContracts.Sponsor
      };
  }
};

export default getEnvConfig;
