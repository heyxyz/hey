import LazySmallSingleAccount from "@components/Shared/LazySmallSingleAccount";
import Loader from "@components/Shared/Loader";
import Slug from "@components/Shared/Slug";
import errorToast from "@helpers/errorToast";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import {
  useAssignUsernameToAccountMutation,
  useUnassignUsernameFromAccountMutation,
  useUsernamesQuery
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, EmptyState } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

const LinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [linkingUsername, setLinkingUsername] = useState<null | string>(null);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const onCompleted = (hash: string) => {
    setLinkingUsername(null);
    addSimpleOptimisticTransaction(hash, OptimisticTxType.ASSIGN_USERNAME);
    toast.success("Linked");
  };

  const onError = (error: any) => {
    setLinkingUsername(null);
    errorToast(error);
  };

  const { data, loading } = useUsernamesQuery({
    variables: { request: { filter: { owner: currentAccount?.address } } }
  });

  const [assignUsernameToAccount] = useAssignUsernameToAccountMutation({
    onCompleted: async ({ assignUsernameToAccount }) => {
      if (assignUsernameToAccount.__typename === "AssignUsernameResponse") {
        return onCompleted(assignUsernameToAccount.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: assignUsernameToAccount,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleLink = async (localName: string) => {
    if (!currentAccount) {
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    const confirmation = confirm("Are you sure you want to link this handle?");

    if (!confirmation) {
      return;
    }

    setLinkingUsername(localName);

    return await assignUsernameToAccount({
      variables: { request: { username: { localName } } }
    });
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

    setLinkingUsername(null);

    return await unassignUsernameFromAccount({
      variables: { request: { namespace: currentAccount.username?.namespace } }
    });
  };

  if (loading) {
    return <Loader className="py-10" />;
  }

  const usernames = data?.usernames.items;

  if (!usernames?.length) {
    return (
      <EmptyState
        hideCard
        icon={<AtSymbolIcon className="size-8" />}
        message="No usernames found to link!"
      />
    );
  }

  return (
    <div className="m-5 space-y-6">
      {usernames?.map((username) => (
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          key={username.value}
        >
          <div className="flex items-center space-x-2">
            <Slug className="font-bold" slug={username.value} />
            {username.linkedTo ? (
              <div className="flex items-center space-x-2">
                <span>·</span>
                <div>Linked to</div>
                <LazySmallSingleAccount address={username.linkedTo} />
              </div>
            ) : null}
          </div>
          {username.linkedTo ? (
            <Button
              disabled={linkingUsername === username.localName}
              onClick={() => handleUnlink()}
              outline
            >
              Unlink
            </Button>
          ) : (
            <Button
              disabled={linkingUsername === username.localName}
              onClick={() => handleLink(username.localName)}
              outline
            >
              Link
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
