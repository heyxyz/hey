import {
  MAINNET_DEFAULT_TOKEN,
  MAINNET_FREE_COLLECT_MODULE,
  MAINNET_LENS_PERIPHERY,
  MAINNET_LENSHUB_PROXY,
  MAINNET_NETUPDATEOWNABLEFEECOLLECTMODULEADDRESS,
  SANDBOX_FREE_COLLECT_MODULE,
  SANDBOX_LENS_PERIPHERY,
  SANDBOX_LENSHUB_PROXY,
  TESTNET_DEFAULT_TOKEN,
  TESTNET_FREE_COLLECT_MODULE,
  TESTNET_LENS_PERIPHERY,
  TESTNET_LENSHUB_PROXY,
  TESTNET_UPDATEOWNABLEFEECOLLECTMODULEADDRESS
} from 'data/contracts';
import { LENS_NETWORK, MAINNET_API_URL, SANDBOX_API_URL, TESTNET_API_URL } from 'src/constants';

const getEnvConfig = () => {
  switch (LENS_NETWORK) {
    case 'mainnet':
      return {
        apiEndpoint: MAINNET_API_URL,
        lensHubProxyAddress: MAINNET_LENSHUB_PROXY,
        lensPeripheryAddress: MAINNET_LENS_PERIPHERY,
        freeCollectModuleAddress: MAINNET_FREE_COLLECT_MODULE,
        defaultCollectToken: MAINNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: MAINNET_NETUPDATEOWNABLEFEECOLLECTMODULEADDRESS
      };
    case 'testnet':
      return {
        apiEndpoint: TESTNET_API_URL,
        lensHubProxyAddress: TESTNET_LENSHUB_PROXY,
        lensPeripheryAddress: TESTNET_LENS_PERIPHERY,
        freeCollectModuleAddress: TESTNET_FREE_COLLECT_MODULE,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: TESTNET_UPDATEOWNABLEFEECOLLECTMODULEADDRESS
      };
    case 'sandbox':
      return {
        apiEndpoint: SANDBOX_API_URL,
        lensHubProxyAddress: SANDBOX_LENSHUB_PROXY,
        lensPeripheryAddress: SANDBOX_LENS_PERIPHERY,
        freeCollectModuleAddress: SANDBOX_FREE_COLLECT_MODULE,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: TESTNET_UPDATEOWNABLEFEECOLLECTMODULEADDRESS
      };
    default:
      return {
        apiEndpoint: MAINNET_API_URL,
        lensHubProxyAddress: MAINNET_LENSHUB_PROXY,
        lensPeripheryAddress: MAINNET_LENS_PERIPHERY,
        freeCollectModuleAddress: MAINNET_FREE_COLLECT_MODULE,
        defaultCollectToken: MAINNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: MAINNET_NETUPDATEOWNABLEFEECOLLECTMODULEADDRESS
      };
  }
};

export default getEnvConfig;
