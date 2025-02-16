import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  type Account,
  type Group,
  type LoggedInGroupOperations,
  useBanGroupAccountsMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Tooltip } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface BanProps {
  group: Group;
  account: Account;
}

const Ban: FC<BanProps> = ({ group, account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useGlobalModalStateStore();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      banOn: account.address,
      txHash,
      type: OptimisticTxType.BAN_GROUP_ACCOUNT
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: { isBanned: () => true },
      id: cache.identify(group.operations as LoggedInGroupOperations)
    });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
    setIsLoading(false);
    toast.success("Followed");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [banGroupAccounts] = useBanGroupAccountsMutation({
    onCompleted: async ({ banGroupAccounts }) => {
      if (banGroupAccounts.__typename === "BanGroupAccountsResponse") {
        return onCompleted(banGroupAccounts.hash);
      }

      if (walletClient) {
        try {
          if (banGroupAccounts.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(banGroupAccounts.raw)
            });

            return onCompleted(hash);
          }

          if (banGroupAccounts.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(banGroupAccounts.raw)
            });

            return onCompleted(hash);
          }

          if (banGroupAccounts.__typename === "TransactionWillFail") {
            return onError({ message: banGroupAccounts.reason });
          }
        } catch (error) {
          return onError(error);
        }
      }
    },
    onError
  });

  const handleBan = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return banGroupAccounts({
      variables: {
        request: { accounts: [account.address], group: group.address }
      }
    });
  };

  if (group.owner !== currentAccount?.address) {
    return null;
  }

  if (group.owner === account.address) {
    return null;
  }

  return (
    <Tooltip content="Ban" placement="top">
      <button onClick={handleBan} type="button" disabled={isLoading}>
        <NoSymbolIcon className="size-4 text-red-500" />
      </button>
    </Tooltip>
  );
};

export default Ban;
