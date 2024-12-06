import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { useUnassignUsernameFromAccountMutation } from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

const UnlinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { addTransaction } = useTransactionStore();
  const [unlinking, setUnlinking] = useState<boolean>(false);
  const { data: walletClient } = useWalletClient();

  const generateOptimisticUnassignUsername = ({
    txHash
  }: {
    txHash: string;
  }): OptimisticTransaction => {
    return {
      txHash,
      type: OptmisticPostType.UnassignUsername
    };
  };

  const onCompleted = (hash: string) => {
    setUnlinking(false);
    addTransaction(generateOptimisticUnassignUsername({ txHash: hash }));
    toast.success("Unlinked");
  };

  const onError = (error: any) => {
    setUnlinking(false);
    errorToast(error);
  };

  const [unassignUsernameFromAccount] = useUnassignUsernameFromAccountMutation({
    onCompleted: async ({ unassignUsernameFromAccount }) => {
      if (
        unassignUsernameFromAccount.__typename === "UnassignUsernameResponse"
      ) {
        return onCompleted(unassignUsernameFromAccount.hash);
      }

      if (walletClient) {
        try {
          if (
            unassignUsernameFromAccount.__typename ===
            "SponsoredTransactionRequest"
          ) {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(unassignUsernameFromAccount.raw)
            });

            return onCompleted(hash);
          }

          if (
            unassignUsernameFromAccount.__typename ===
            "SelfFundedTransactionRequest"
          ) {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(unassignUsernameFromAccount.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (unassignUsernameFromAccount.__typename === "TransactionWillFail") {
        return toast.error(unassignUsernameFromAccount.reason);
      }
    },
    onError
  });

  const handleUnlink = async () => {
    if (!currentAccount) {
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setUnlinking(true);

    return await unassignUsernameFromAccount({
      variables: { request: { namespace: currentAccount.username?.namespace } }
    });
  };

  return (
    <Button className="m-5" disabled={unlinking} onClick={handleUnlink} outline>
      Un-link handle
    </Button>
  );
};

export default UnlinkHandle;
