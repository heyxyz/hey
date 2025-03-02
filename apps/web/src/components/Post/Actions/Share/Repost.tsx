import { useApolloClient } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type LoggedInPostOperationsFragment,
  type PostFragment,
  useRepostMutation
} from "@hey/indexer";
import cn from "@hey/ui/cn";
import { useCounter } from "@uidotdev/usehooks";
import type { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface RepostProps {
  isSubmitting: boolean;
  post: PostFragment;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}

const Repost: FC<RepostProps> = ({ isSubmitting, post, setIsSubmitting }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const hasReposted =
    post.operations?.hasReposted.optimistic ||
    post.operations?.hasReposted.onChain;
  const [shares, { increment }] = useCounter(
    post.stats.reposts + post.stats.quotes
  );
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: {
        hasReposted: (existingValue) => {
          return { ...existingValue, optimistic: true };
        }
      },
      id: cache.identify(post.operations as LoggedInPostOperationsFragment)
    });
    cache.modify({
      fields: {
        stats: (existingData) => ({
          ...existingData,
          reposts: shares + 1
        })
      },
      id: cache.identify(post)
    });
  };

  const onCompleted = () => {
    setIsSubmitting(false);
    increment();
    updateCache();
    trackEvent(Events.Post.Repost);
    toast.success("Post has been reposted!");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [repost] = useRepostMutation({
    onCompleted: async ({ repost }) => {
      if (repost.__typename === "PostResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: repost,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleCreateRepost = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

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
      disabled={isSubmitting}
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
