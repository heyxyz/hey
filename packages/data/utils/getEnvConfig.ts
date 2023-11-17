import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  apiEndpoint: string;
  lensHubProxyAddress: `0x${string}`;
  publicActProxyAddress: `0x${string}`;
  defaultCollectToken: string;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        apiEndpoint: LensEndpoint.Testnet,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        publicActProxyAddress: TestnetContracts.PublicActProxy,
        defaultCollectToken: TestnetContracts.DefaultToken
      };
    default:
      return {
        apiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        publicActProxyAddress: MainnetContracts.PublicActProxy,
        defaultCollectToken: MainnetContracts.DefaultToken
      };
  }
};

export default getEnvConfig;
