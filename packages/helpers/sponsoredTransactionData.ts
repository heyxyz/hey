import type { Eip712TransactionRequest } from "@hey/indexer";
import type { SendEip712TransactionParameters } from "viem/zksync";

const sponsoredTransactionData = (
  raw: Eip712TransactionRequest
): SendEip712TransactionParameters => {
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
