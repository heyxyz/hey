import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";
import useHandleWrongNetwork from "./useHandleWrongNetwork";

const useTransactionLifecycle = () => {
  const { data } = useWalletClient();
  const handleWrongNetwork = useHandleWrongNetwork();

  const handleTransactionLifecycle = async ({
    transactionData,
    onCompleted,
    onError
  }: {
    transactionData: any;
    onCompleted: (hash: string) => void;
    onError: (error: any) => void;
  }) => {
    if (!data) return;

    try {
      if (transactionData.__typename === "SponsoredTransactionRequest") {
        await handleWrongNetwork();
        const hash = await sendEip712Transaction(data, {
          account: data.account,
          ...sponsoredTransactionData(transactionData.raw)
        });
        return onCompleted(hash);
      }

      if (transactionData.__typename === "SelfFundedTransactionRequest") {
        await handleWrongNetwork();
        const hash = await sendTransaction(data, {
          account: data.account,
          ...selfFundedTransactionData(transactionData.raw)
        });
        return onCompleted(hash);
      }

      if (transactionData.__typename === "TransactionWillFail") {
        return onError({ message: transactionData.reason });
      }
    } catch (error) {
      return onError(error);
    }
  };

  return { handleTransactionLifecycle };
};

export default useTransactionLifecycle;
