import type { ApolloCache } from "@apollo/client";
import { useHiddenCommentFeedStore } from "@components/Post";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type {
  HideCommentRequest,
  MirrorablePublication,
  UnhideCommentRequest
} from "@hey/lens";
import { useHideCommentMutation, useUnhideCommentMutation } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { toast } from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface HideCommentProps {
  post: MirrorablePublication;
}

const HideComment: FC<HideCommentProps> = ({ post }) => {
  const { currentAccount } = useAccountStore();
  const { showHiddenComments } = useHiddenCommentFeedStore();

  const request: HideCommentRequest | UnhideCommentRequest = {
    for: post.id
  };

  const updateCache = (cache: ApolloCache<any>) => {
    cache.evict({ id: cache.identify(post) });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [hideComment] = useHideCommentMutation({
    onCompleted: () => {
      toast.success("Comment hidden");
      Leafwatch.track(POST.TOGGLE_HIDE_COMMENT, {
        hidden: true,
        postId: post.id
      });
    },
    onError,
    update: updateCache,
    variables: { request }
  });

  const [unhideComment] = useUnhideCommentMutation({
    onCompleted: () => {
      toast.success("Comment unhidden");
      Leafwatch.track(POST.TOGGLE_HIDE_COMMENT, {
        hidden: false,
        postId: post.id
      });
    },
    onError,
    update: updateCache,
    variables: { request }
  });

  const canHideComment = currentAccount?.id !== post?.by?.id;

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
