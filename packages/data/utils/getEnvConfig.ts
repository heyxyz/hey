import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import HeyEndpoint from '../hey-endpoints';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  defaultCollectToken: string;
  heyApiEndpoint: string;
  lensApiEndpoint: string;
  lensHubProxyAddress: `0x${string}`;
  publicActProxyAddress: `0x${string}`;
  tokenHandleRegistry: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Testnet,
        lensApiEndpoint: LensEndpoint.Testnet,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        publicActProxyAddress: TestnetContracts.PublicActProxy,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    case 'staging':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Staging,
        lensApiEndpoint: LensEndpoint.Staging,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        publicActProxyAddress: TestnetContracts.PublicActProxy,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Mainnet,
        lensApiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        publicActProxyAddress: MainnetContracts.PublicActProxy,
        tokenHandleRegistry: MainnetContracts.TokenHandleRegistry
      };
  }
};

export default getEnvConfig;
