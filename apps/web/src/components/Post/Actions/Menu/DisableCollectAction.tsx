import type { ApolloCache } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { type Post, useDisablePostActionMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface DisableCollectActionProps {
  post: Post;
}

const DisableCollectAction: FC<DisableCollectActionProps> = ({ post }) => {
  const { currentAccount } = useAccountStore();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const enabled = post.actions.some(
    (action) => action.__typename === "SimpleCollectAction"
  );

  if (currentAccount?.address !== post.author.address) {
    return null;
  }

  if (!enabled) {
    return null;
  }

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        actions: (existingActions = []) =>
          existingActions.filter(
            (action: any) => action.__typename !== "SimpleCollectAction"
          )
      },
      id: cache.identify(post)
    });
  };

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.DISABLE_COLLECT);
    toast.success("Collect action disabled");
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [disablePostAction] = useDisablePostActionMutation({
    onCompleted: async ({ disablePostAction }) => {
      return await handleTransactionLifecycle({
        transactionData: disablePostAction,
        onCompleted,
        onError
      });
    },
    onError,
    update: updateCache
  });

  const handleToggleCollect = async () => {
    return await disablePostAction({
      variables: {
        request: { action: { simpleCollect: true }, post: post.id }
      }
    });
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        handleToggleCollect();
      }}
    >
      <div className="flex items-center space-x-2">
        <ShoppingBagIcon className="size-4" />
        <div>Disable Collect</div>
      </div>
    </MenuItem>
  );
};

export default DisableCollectAction;
