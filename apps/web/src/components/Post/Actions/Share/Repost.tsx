import { useApolloClient } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  type LoggedInPostOperations,
  type Post,
  TriStateValue,
  useRepostMutation
} from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import cn from "@hey/ui/cn";
import { useCounter } from "@uidotdev/usehooks";
import type { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface RepostProps {
  isLoading: boolean;
  post: Post;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Repost: FC<RepostProps> = ({ isLoading, post, setIsLoading }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { addTransaction } = useTransactionStore();
  const hasReposted = post.operations?.hasReposted.optimistic;

  const [shares, { increment }] = useCounter(
    post.stats.reposts + post.stats.quotes
  );

  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const generateOptimisticRepost = ({
    txHash
  }: {
    txHash: string;
  }): OptimisticTransaction => {
    return {
      repostOf: post?.id,
      txHash,
      type: OptmisticPostType.Repost
    };
  };

  const updateCache = () => {
    cache.modify({
      fields: {
        hasReposted: (existingValue) => {
          return { ...existingValue, optimistic: true };
        }
      },
      id: cache.identify(post.operations as LoggedInPostOperations)
    });
    cache.modify({
      fields: { reposts: () => shares + 1 },
      id: cache.identify(post.stats)
    });
  };

  const onCompleted = (hash: string) => {
    setIsLoading(false);
    increment();
    updateCache();
    addTransaction(generateOptimisticRepost({ txHash: hash }));
    toast.success("Post has been reposted!");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [repost] = useRepostMutation({
    onCompleted: async ({ repost }) => {
      if (repost.__typename === "PostResponse") {
        return onCompleted(repost.hash);
      }

      if (walletClient) {
        try {
          if (repost.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(repost.raw)
            });

            return onCompleted(hash);
          }

          if (repost.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(repost.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (repost.__typename === "TransactionWillFail") {
        return toast.error(repost.reason);
      }
    },
    onError
  });

  if (post.operations?.canRepost === TriStateValue.No) {
    return null;
  }

  const handleCreateRepost = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await repost({ variables: { request: { post: post.id } } });
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          hasReposted ? "text-green-500" : "",
          "m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm"
        )
      }
      disabled={isLoading}
      onClick={handleCreateRepost}
    >
      <div className="flex items-center space-x-2">
        <ArrowsRightLeftIcon className="size-4" />
        <div>{hasReposted ? "Repost again" : "Repost"}</div>
      </div>
    </MenuItem>
  );
};

export default Repost;
