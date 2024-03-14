import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import HeyEndpoint from '../hey-endpoints';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  defaultCollectToken: string;
  heyApiEndpoint: string;
  heyLensSignup: `0x${string}`;
  lensApiEndpoint: string;
  lensHandles: `0x${string}`;
  lensHubProxyAddress: `0x${string}`;
  permissionlessCreator?: `0x${string}`;
  tokenHandleRegistry: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Testnet,
        heyLensSignup: TestnetContracts.HeyLensSignup,
        lensApiEndpoint: LensEndpoint.Testnet,
        lensHandles: TestnetContracts.LensHandles,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    case 'staging':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Staging,
        heyLensSignup: TestnetContracts.HeyLensSignup,
        lensApiEndpoint: LensEndpoint.Staging,
        lensHandles: TestnetContracts.LensHandles,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Mainnet,
        heyLensSignup: MainnetContracts.HeyLensSignup,
        lensApiEndpoint: LensEndpoint.Mainnet,
        lensHandles: MainnetContracts.LensHandles,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        permissionlessCreator: MainnetContracts.PermissionlessCreator,
        tokenHandleRegistry: MainnetContracts.TokenHandleRegistry
      };
  }
};

export default getEnvConfig;
