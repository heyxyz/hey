import type { EthereumNode } from '@lens-protocol/data-availability-verifier';
import { checkDAProof, Environment } from '@lens-protocol/data-availability-verifier';

const getDaVerified = async (proof: string) => {
  const ethereumNode: EthereumNode = {
    environment: Environment.MUMBAI,
    nodeUrl: 'https://rpc.ankr.com/polygon_mumbai'
  };
  const result = await checkDAProof(proof, ethereumNode);
  if (result.isSuccess()) {
    console.log('proof valid', result.successResult!);
    return true;
  }

  return false;
};

export default getDaVerified;
