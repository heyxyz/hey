import LazySmallSingleAccount from "@components/Shared/LazySmallSingleAccount";
import Loader from "@components/Shared/Loader";
import Slug from "@components/Shared/Slug";
import errorToast from "@helpers/errorToast";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
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
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

const LinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();

  const [linkingUsername, setLinkingUsername] = useState<null | string>(null);
  const { data: walletClient } = useWalletClient();

  const onCompleted = (hash: string) => {
    setLinkingUsername(null);
    addSimpleOptimisticTransaction(
      hash,
      OptimisticTxType.ASSIGN_USERNAME
    );
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

      if (walletClient) {
        try {
          if (
            assignUsernameToAccount.__typename === "SponsoredTransactionRequest"
          ) {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(assignUsernameToAccount.raw)
            });

            return onCompleted(hash);
          }

          if (
            assignUsernameToAccount.__typename ===
            "SelfFundedTransactionRequest"
          ) {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(assignUsernameToAccount.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (assignUsernameToAccount.__typename === "TransactionWillFail") {
        return toast.error(assignUsernameToAccount.reason);
      }
    },
    onError
  });

  const handleLink = async (namespace: string, localName: string) => {
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

    setLinkingUsername(`${namespace}:${localName}`);

    return await assignUsernameToAccount({
      variables: { request: { username: { namespace, localName } } }
    });
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
          {username.linkedTo ?
            <Button
              disabled={linkingUsername === `${username.namespace}:${username.localName}`}
              onClick={() => handleLink(username.namespace, username.localName)}
              outline
            >
              Unlink
            </Button>
            :
            <Button
              disabled={linkingUsername === `${username.namespace}:${username.localName}`}
              onClick={() => handleLink(username.namespace, username.localName)}
              outline
            >
              Link
            </Button>}
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
