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
  useUsernamesQuery
} from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Button, EmptyState } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

const LinkHandle: FC = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { addTransaction } = useTransactionStore();

  const [linkingUsername, setLinkingUsername] = useState<null | string>(null);
  const { data: walletClient } = useWalletClient();

  const generateOptimisticAssignUsername = ({
    txHash
  }: {
    txHash: string;
  }): OptimisticTransaction => {
    return {
      txHash,
      type: OptmisticPostType.AssignUsername
    };
  };

  const onCompleted = (hash: string) => {
    setLinkingUsername(null);
    addTransaction(generateOptimisticAssignUsername({ txHash: hash }));
    toast.success("Linked");
  };

  const { data, loading } = useUsernamesQuery({
    variables: { request: { owner: currentAccount?.owner } }
  });

  const [assignUsernameToAccount] = useAssignUsernameToAccountMutation({
    onCompleted: async ({ assignUsernameToAccount }) => {
      if (assignUsernameToAccount.__typename === "AssignUsernameResponse") {
        return onCompleted(assignUsernameToAccount.hash);
      }

      if (walletClient) {
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
          assignUsernameToAccount.__typename === "SelfFundedTransactionRequest"
        ) {
          const hash = await sendTransaction(walletClient, {
            account: walletClient.account,
            ...selfFundedTransactionData(assignUsernameToAccount.raw)
          });

          return onCompleted(hash);
        }
      }

      if (assignUsernameToAccount.__typename === "TransactionWillFail") {
        return toast.error(assignUsernameToAccount.reason);
      }
    },
    onError: (error) => {
      setLinkingUsername(null);
      errorToast(error);
    }
  });

  const handleLink = async (username: string) => {
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

    setLinkingUsername(username);

    return await assignUsernameToAccount({
      variables: { request: { username: { localName: username } } }
    });
  };

  if (loading) {
    return <Loader className="py-10" />;
  }

  const availableUsernames = data?.usernames.items.filter(
    (handle) => handle.linkedTo !== currentAccount?.address
  );

  if (!availableUsernames?.length) {
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
      {availableUsernames?.map((username) => (
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
          <Button
            disabled={linkingUsername === username.value}
            onClick={() => handleLink(username.value)}
            outline
          >
            {username.linkedTo ? "Unlink and Link" : "Link"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
