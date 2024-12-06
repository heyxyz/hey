import errorToast from "@helpers/errorToast";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

type TransactionHandlerArgs = {
  mutationResult: any;
  onCompleted: (hash: string) => void;
};

export const useTransactionHandler = () => {
  const { data: walletClient } = useWalletClient();

  const handleTransaction = useCallback(
    async ({ mutationResult, onCompleted }: TransactionHandlerArgs) => {
      const { __typename, hash, raw, reason } = mutationResult;

      if (__typename === "SetAccountMetadataResponse") {
        return onCompleted(hash);
      }

      if (walletClient) {
        try {
          if (__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(raw)
            });
            return onCompleted(hash);
          }

          if (__typename === "SelfFundedTransactionRequest") {
            const transactionHash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(raw)
            });
            return onCompleted(transactionHash);
          }
        } catch (error) {
          return errorToast(error);
        }
      }

      if (__typename === "TransactionWillFail") {
        return toast.error(reason);
      }
    },
    []
  );

  return { handleTransaction };
};
