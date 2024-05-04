import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import HeyEndpoint from '../hey-endpoints';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  defaultCollectToken: string;
  heyApiEndpoint: string;
  heyLensSignup: `0x${string}`;
  heyPro: `0x${string}`;
  heyTipping: `0x${string}`;
  lensApiEndpoint: string;
  lensHandles: `0x${string}`;
  lensHub: `0x${string}`;
  permissionlessCreator?: `0x${string}`;
  tokenHandleRegistry: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'testnet':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Testnet,
        heyLensSignup: TestnetContracts.HeyLensSignup,
        heyPro: TestnetContracts.HeyPro,
        heyTipping: TestnetContracts.HeyTipping,
        lensApiEndpoint: LensEndpoint.Testnet,
        lensHandles: TestnetContracts.LensHandles,
        lensHub: TestnetContracts.LensHub,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    case 'staging':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Staging,
        heyLensSignup: TestnetContracts.HeyLensSignup,
        heyPro: TestnetContracts.HeyPro,
        heyTipping: TestnetContracts.HeyTipping,
        lensApiEndpoint: LensEndpoint.Staging,
        lensHandles: TestnetContracts.LensHandles,
        lensHub: TestnetContracts.LensHub,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        heyApiEndpoint: HeyEndpoint.Mainnet,
        heyLensSignup: MainnetContracts.HeyLensSignup,
        heyPro: MainnetContracts.HeyPro,
        heyTipping: MainnetContracts.HeyTipping,
        lensApiEndpoint: LensEndpoint.Mainnet,
        lensHandles: MainnetContracts.LensHandles,
        lensHub: MainnetContracts.LensHub,
        permissionlessCreator: MainnetContracts.PermissionlessCreator,
        tokenHandleRegistry: MainnetContracts.TokenHandleRegistry
      };
  }
};

export default getEnvConfig;
