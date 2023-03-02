import type { EthereumNode } from '@lens-protocol/data-availability-verifier';
import { checkDAProof, Deployment, Environment } from '@lens-protocol/data-availability-verifier';

const getDaVerified = async (proof: string) => {
  const ethereumNode: EthereumNode = {
    environment: Environment.MUMBAI,
    deployment: Deployment.STAGING,
    nodeUrl: 'https://rpc.ankr.com/polygon_mumbai'
  };
  console.log('proof', proof);
  const result = await checkDAProof(proof, ethereumNode);
  if (result.isSuccess()) {
    console.log('proof valid', result.successResult!);
    return true;
  }

  console.log('proof valid', result);
  return false;
};

export default getDaVerified;
