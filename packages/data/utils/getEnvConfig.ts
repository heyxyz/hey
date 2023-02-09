import {
  LENS_NETWORK,
  MAINNET_API_URL,
  SANDBOX_API_URL,
  STAGING_API_URL,
  STAGING_SANDBOX_API_URL,
  TESTNET_API_URL
} from '../constants';
import {
  MAINNET_DEFAULT_TOKEN,
  MAINNET_LENS_PERIPHERY,
  MAINNET_LENSHUB_PROXY,
  MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
  QUADRATIC_MODULE_NOT_SUPPORTED,
  SANDBOX_LENS_PERIPHERY,
  SANDBOX_LENSHUB_PROXY,
  SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE,
  TESTNET_DEFAULT_TOKEN,
  TESTNET_LENS_PERIPHERY,
  TESTNET_LENSHUB_PROXY,
  TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS
} from '../contracts';

const getEnvConfig = (): {
  apiEndpoint: string;
  lensHubProxyAddress: `0x${string}`;
  lensPeripheryAddress: `0x${string}`;
  defaultCollectToken: string;
  UpdateOwnableFeeCollectModuleAddress: `0x${string}`;
  litProtocolEnvironment: string;
  QuadraticVoteCollectModuleAddress: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'mainnet':
      return {
        apiEndpoint: MAINNET_API_URL,
        lensHubProxyAddress: MAINNET_LENSHUB_PROXY,
        lensPeripheryAddress: MAINNET_LENS_PERIPHERY,
        defaultCollectToken: MAINNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        litProtocolEnvironment: 'polygon',
        QuadraticVoteCollectModuleAddress: QUADRATIC_MODULE_NOT_SUPPORTED
      };
    case 'testnet':
      return {
        apiEndpoint: TESTNET_API_URL,
        lensHubProxyAddress: TESTNET_LENSHUB_PROXY,
        lensPeripheryAddress: TESTNET_LENS_PERIPHERY,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        litProtocolEnvironment: 'mumbai',
        QuadraticVoteCollectModuleAddress: QUADRATIC_MODULE_NOT_SUPPORTED
      };
    case 'staging':
      return {
        apiEndpoint: STAGING_API_URL,
        lensHubProxyAddress: TESTNET_LENSHUB_PROXY,
        lensPeripheryAddress: TESTNET_LENS_PERIPHERY,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        litProtocolEnvironment: 'mumbai',
        QuadraticVoteCollectModuleAddress: QUADRATIC_MODULE_NOT_SUPPORTED
      };
    case 'sandbox':
      return {
        apiEndpoint: SANDBOX_API_URL,
        lensHubProxyAddress: SANDBOX_LENSHUB_PROXY,
        lensPeripheryAddress: SANDBOX_LENS_PERIPHERY,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        litProtocolEnvironment: 'mumbai-sandbox',
        QuadraticVoteCollectModuleAddress: SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE
      };
    case 'staging-sandbox':
      return {
        apiEndpoint: STAGING_SANDBOX_API_URL,
        lensHubProxyAddress: SANDBOX_LENSHUB_PROXY,
        lensPeripheryAddress: SANDBOX_LENS_PERIPHERY,
        defaultCollectToken: TESTNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: TESTNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        litProtocolEnvironment: 'mumbai-sandbox',
        QuadraticVoteCollectModuleAddress: QUADRATIC_MODULE_NOT_SUPPORTED
      };
    default:
      return {
        apiEndpoint: MAINNET_API_URL,
        lensHubProxyAddress: MAINNET_LENSHUB_PROXY,
        lensPeripheryAddress: MAINNET_LENS_PERIPHERY,
        defaultCollectToken: MAINNET_DEFAULT_TOKEN,
        UpdateOwnableFeeCollectModuleAddress: MAINNET_UPDATE_OWNABLE_FEE_COLLECT_MODULE_ADDRESS,
        litProtocolEnvironment: 'polygon',
        QuadraticVoteCollectModuleAddress: QUADRATIC_MODULE_NOT_SUPPORTED
      };
  }
};

export default getEnvConfig;
