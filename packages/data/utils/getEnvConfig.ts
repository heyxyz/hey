import { LENS_NETWORK } from '../constants';
import { MainnetContracts, SandboxContracts, TestnetContracts } from '../contracts';
import LensEndpoint from '../lens-endpoints';

const getEnvConfig = (): {
  apiEndpoint: string;
  lensHubProxyAddress: `0x${string}`;
  lensPeripheryAddress: `0x${string}`;
  defaultCollectToken: string;
  UpdateOwnableFeeCollectModuleAddress: `0x${string}`;
  litProtocolEnvironment: string;
  QuadraticVoteCollectModuleAddress: `0x${string}`;
  GrantsRound: `0x${string}`;
  VotingStrategy: `0x${string}`;
  FundingCurator: `0x${string}`;
} => {
  switch (LENS_NETWORK) {
    case 'mainnet':
      return {
        apiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        lensPeripheryAddress: MainnetContracts.LensPeriphery,
        defaultCollectToken: MainnetContracts.DefaultToken,
        UpdateOwnableFeeCollectModuleAddress: MainnetContracts.UpdateOwnableFeeCollectModule,
        litProtocolEnvironment: 'polygon',
        QuadraticVoteCollectModuleAddress: MainnetContracts.QuadraticVoteCollectModuleAddress,
        GrantsRound: MainnetContracts.GrantsRound,
        VotingStrategy: MainnetContracts.VotingStrategy,
        FundingCurator: MainnetContracts.FundingCurator
      };
    case 'testnet':
      return {
        apiEndpoint: LensEndpoint.Testnet,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        lensPeripheryAddress: TestnetContracts.LensPeriphery,
        defaultCollectToken: TestnetContracts.DefaultToken,
        UpdateOwnableFeeCollectModuleAddress: TestnetContracts.UpdateOwnableFeeCollectModule,
        litProtocolEnvironment: 'mumbai',
        QuadraticVoteCollectModuleAddress: TestnetContracts.QuadraticVoteCollectModuleAddress,
        GrantsRound: TestnetContracts.GrantsRound,
        VotingStrategy: TestnetContracts.VotingStrategy,
        FundingCurator: TestnetContracts.FundingCurator
      };
    case 'staging':
      return {
        apiEndpoint: LensEndpoint.Staging,
        lensHubProxyAddress: TestnetContracts.LensHubProxy,
        lensPeripheryAddress: TestnetContracts.LensPeriphery,
        defaultCollectToken: TestnetContracts.DefaultToken,
        UpdateOwnableFeeCollectModuleAddress: TestnetContracts.UpdateOwnableFeeCollectModule,
        litProtocolEnvironment: 'mumbai',
        QuadraticVoteCollectModuleAddress: TestnetContracts.QuadraticVoteCollectModuleAddress,
        GrantsRound: TestnetContracts.GrantsRound,
        VotingStrategy: TestnetContracts.VotingStrategy,
        FundingCurator: TestnetContracts.FundingCurator
      };
    case 'sandbox':
      return {
        apiEndpoint: LensEndpoint.Sandbox,
        lensHubProxyAddress: SandboxContracts.LensHubProxy,
        lensPeripheryAddress: SandboxContracts.LensPeriphery,
        defaultCollectToken: TestnetContracts.DefaultToken,
        UpdateOwnableFeeCollectModuleAddress: SandboxContracts.SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE,
        litProtocolEnvironment: 'mumbai-sandbox',
        QuadraticVoteCollectModuleAddress: SandboxContracts.SANDBOX_QUADRATIC_VOTE_COLLECT_MODULE,
        GrantsRound: SandboxContracts.SANDBOX_GRANTS_ROUND,
        VotingStrategy: SandboxContracts.SANDBOX_VOTING_STRATEGY,
        FundingCurator: SandboxContracts.SANDBOX_QUADRATIC_FUNDING_CURATOR
      };
    case 'staging-sandbox':
      return {
        apiEndpoint: LensEndpoint.StagingSandbox,
        lensHubProxyAddress: SandboxContracts.LensHubProxy,
        lensPeripheryAddress: SandboxContracts.LensPeriphery,
        defaultCollectToken: TestnetContracts.DefaultToken,
        UpdateOwnableFeeCollectModuleAddress: TestnetContracts.UpdateOwnableFeeCollectModule,
        litProtocolEnvironment: 'mumbai-sandbox',
        QuadraticVoteCollectModuleAddress: TestnetContracts.QuadraticVoteCollectModuleAddress,
        GrantsRound: SandboxContracts.SANDBOX_GRANTS_ROUND,
        VotingStrategy: SandboxContracts.SANDBOX_VOTING_STRATEGY,
        FundingCurator: SandboxContracts.SANDBOX_QUADRATIC_FUNDING_CURATOR
      };
    default:
      return {
        apiEndpoint: LensEndpoint.Mainnet,
        lensHubProxyAddress: MainnetContracts.LensHubProxy,
        lensPeripheryAddress: MainnetContracts.LensPeriphery,
        defaultCollectToken: MainnetContracts.DefaultToken,
        UpdateOwnableFeeCollectModuleAddress: MainnetContracts.UpdateOwnableFeeCollectModule,
        litProtocolEnvironment: 'polygon',
        QuadraticVoteCollectModuleAddress: MainnetContracts.QuadraticVoteCollectModuleAddress,
        GrantsRound: MainnetContracts.GrantsRound,
        VotingStrategy: MainnetContracts.VotingStrategy,
        FundingCurator: MainnetContracts.FundingCurator
      };
  }
};

export default getEnvConfig;
