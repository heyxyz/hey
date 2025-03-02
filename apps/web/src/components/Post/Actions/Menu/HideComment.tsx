import type { ApolloCache } from "@apollo/client";
import { useHiddenCommentFeedStore } from "@components/Post";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import {
  type PostFragment,
  useHideReplyMutation,
  useUnhideReplyMutation
} from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { toast } from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface HideCommentProps {
  post: PostFragment;
}

const HideComment: FC<HideCommentProps> = ({ post }) => {
  const { currentAccount } = useAccountStore();
  const { showHiddenComments } = useHiddenCommentFeedStore();

  const updateCache = (cache: ApolloCache<any>) => {
    cache.evict({ id: cache.identify(post) });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [hideComment] = useHideReplyMutation({
    onCompleted: () => {
      toast.success("Comment hidden");
    },
    onError,
    update: updateCache,
    variables: { request: { post: post.id } }
  });

  const [unhideComment] = useUnhideReplyMutation({
    onCompleted: () => {
      toast.success("Comment unhidden");
    },
    onError,
    update: updateCache,
    variables: { request: { post: post.id } }
  });

  const canHideComment = currentAccount?.address !== post?.author?.address;

  if (!canHideComment) {
    return null;
  }

  const handleToggleHideComment = async () => {
    if (showHiddenComments) {
      return await unhideComment();
    }

    return await hideComment();
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
        handleToggleHideComment();
      }}
    >
      <div className="flex items-center space-x-2">
        {showHiddenComments ? (
          <>
            <CheckCircleIcon className="size-4" />
            <div>Unhide comment</div>
          </>
        ) : (
          <>
            <NoSymbolIcon className="size-4" />
            <div>Hide comment</div>
          </>
        )}
      </div>
    </MenuItem>
  );
};

export default HideComment;
