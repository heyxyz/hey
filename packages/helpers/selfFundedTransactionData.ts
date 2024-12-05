import type { Eip1559TransactionRequest } from "@hey/indexer";

const selfFundedTransactionData = (raw: Eip1559TransactionRequest) => {
  return {
    data: raw.data,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    to: raw.to,
    value: BigInt(raw.value)
  };
};

export default selfFundedTransactionData;
