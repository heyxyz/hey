import { LENS_NETWORK } from '../constants';
import { MainnetContracts, TestnetContracts } from '../contracts';
import GoodEndpoint from '../good-endpoints';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  defaultCollectToken: string;
  goodApiEndpoint: string;
  goodLensSignup: `0x${string}`;
  goodPro: `0x${string}`;
  goodTipping: `0x${string}`;
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
        goodApiEndpoint: GoodEndpoint.Testnet,
        goodLensSignup: TestnetContracts.GoodLensSignup,
        goodPro: TestnetContracts.GoodPro,
        goodTipping: TestnetContracts.GoodTipping,
        lensApiEndpoint: LensEndpoint.Testnet,
        lensHandles: TestnetContracts.LensHandles,
        lensHub: TestnetContracts.LensHub,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    case 'staging':
      return {
        defaultCollectToken: TestnetContracts.DefaultToken,
        goodApiEndpoint: GoodEndpoint.Staging,
        goodLensSignup: TestnetContracts.GoodLensSignup,
        goodPro: TestnetContracts.GoodPro,
        goodTipping: TestnetContracts.GoodTipping,
        lensApiEndpoint: LensEndpoint.Staging,
        lensHandles: TestnetContracts.LensHandles,
        lensHub: TestnetContracts.LensHub,
        permissionlessCreator: TestnetContracts.PermissionlessCreator,
        tokenHandleRegistry: TestnetContracts.TokenHandleRegistry
      };
    default:
      return {
        defaultCollectToken: MainnetContracts.DefaultToken,
        goodApiEndpoint: GoodEndpoint.Mainnet,
        goodLensSignup: MainnetContracts.GoodLensSignup,
        goodPro: MainnetContracts.GoodPro,
        goodTipping: MainnetContracts.GoodTipping,
        lensApiEndpoint: LensEndpoint.Mainnet,
        lensHandles: MainnetContracts.LensHandles,
        lensHub: MainnetContracts.LensHub,
        permissionlessCreator: MainnetContracts.PermissionlessCreator,
        tokenHandleRegistry: MainnetContracts.TokenHandleRegistry
      };
  }
};

export default getEnvConfig;
