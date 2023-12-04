import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import HeyEndpoint from '../hey-endpoints';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  lensApiEndpoint: string;
  heyApiEndpoint: string;
  lensHubProxyAddress: `0x${string}`;
  tokenHandleRegistry: `0x${string}`;
  publicActProxyAddress: `0x${string}`;
  defaultCollectToken: string;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        lensApiEndpoint: LensEndpoint.Testnet,
        heyApiEndpoint: HeyEndpoint.Testnet,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry,
        publicActProxyAddress: TestnetContracts.PublicActProxy,
        defaultCollectToken: TestnetContracts.DefaultToken
      };
    case 'staging':
      return {
        lensApiEndpoint: LensEndpoint.Staging,
        heyApiEndpoint: HeyEndpoint.Staging,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry,
        publicActProxyAddress: TestnetContracts.PublicActProxy,
        defaultCollectToken: TestnetContracts.DefaultToken
      };
    default:
      return {
        lensApiEndpoint: LensEndpoint.Mainnet,
        heyApiEndpoint: HeyEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        tokenHandleRegistry: MainnetContracts.TokenHandleRegistry,
        publicActProxyAddress: MainnetContracts.PublicActProxy,
        defaultCollectToken: MainnetContracts.DefaultToken
      };
  }
};

export default getEnvConfig;
