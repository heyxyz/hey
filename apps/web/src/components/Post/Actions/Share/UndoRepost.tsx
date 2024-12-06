import { useApolloClient } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import { POST } from "@hey/data/tracking";
import { isRepost } from "@hey/helpers/postHelpers";
import { type AnyPost, useDeletePostMutation } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface UndoRepostProps {
  isLoading: boolean;
  post: AnyPost;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const UndoRepost: FC<UndoRepostProps> = ({ isLoading, post, setIsLoading }) => {
  const { currentAccount } = useAccountStore();
  const { cache } = useApolloClient();

  const targetPost = isRepost(post) ? post?.repostOf : post;

  const updateCache = () => {
    cache.modify({
      fields: { reposts: () => targetPost.stats.reposts - 1 },
      id: cache.identify(targetPost.stats)
    });
    cache.evict({
      id: `${post?.__typename}:${post?.id}`
    });
  };

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [deletePost] = useDeletePostMutation({
    onCompleted: () => {
      Leafwatch.track(POST.UNDO_REPOST);
      toast.success("Undone repost");
    },
    update: updateCache
  });

  const handleUndoMirror = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);

      return await deletePost({
        variables: { request: { post: post.id } }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-red-500 text-sm"
        )
      }
      disabled={isLoading}
      onClick={handleUndoMirror}
    >
      <div className="flex items-center space-x-2">
        <ArrowsRightLeftIcon className="size-4" />
        <div>Undo mirror</div>
      </div>
    </MenuItem>
  );
};

export default UndoRepost;
