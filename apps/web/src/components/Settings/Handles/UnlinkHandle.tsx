import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { useUnassignUsernameFromAccountMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionHandler";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

const UnlinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [unlinking, setUnlinking] = useState<boolean>(false);
  const { handleTransactionLifecycle } = useTransactionLifecycle();

  const onCompleted = (hash: string) => {
    setUnlinking(false);
    addSimpleOptimisticTransaction(hash, OptimisticTxType.UNASSIGN_USERNAME);
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

      return await handleTransactionLifecycle({
        transactionData: unassignUsernameFromAccount,
        onCompleted,
        onError
      });
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
    <Button disabled={unlinking} onClick={handleUnlink} outline>
      Un-link handle
    </Button>
  );
};

export default UnlinkHandle;
