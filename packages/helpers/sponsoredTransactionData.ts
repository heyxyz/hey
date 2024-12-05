import type { Eip712TransactionRequest } from "@hey/indexer";

const sponsoredTransactionData = (raw: Eip712TransactionRequest) => {
  return {
    data: raw.data,
    gas: BigInt(raw.gasLimit),
    maxFeePerGas: BigInt(raw.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(raw.maxPriorityFeePerGas),
    nonce: raw.nonce,
    paymaster: raw.customData.paymasterParams?.paymaster,
    paymasterInput: raw.customData.paymasterParams?.paymasterInput,
    to: raw.to,
    value: BigInt(raw.value)
  };
};

export default sponsoredTransactionData;
