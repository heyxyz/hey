import type { ApolloCache } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import {
  type LoggedInPostOperationsFragment,
  type PostFragment,
  type PostNotInterestedRequest,
  useAddPostNotInterestedMutation,
  useUndoPostNotInterestedMutation
} from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface NotInterestedProps {
  post: PostFragment;
}

const NotInterested: FC<NotInterestedProps> = ({ post }) => {
  const notInterested = post.operations?.isNotInterested;

  const request: PostNotInterestedRequest = {
    post: post.id
  };

  const updateCache = (cache: ApolloCache<any>, notInterested: boolean) => {
    cache.modify({
      fields: { isNotInterested: () => notInterested },
      id: cache.identify(post.operations as LoggedInPostOperationsFragment)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPostNotInterested] = useAddPostNotInterestedMutation({
    onCompleted: () => {
      toast.success("Marked as not Interested");
    },
    onError,
    update: (cache) => updateCache(cache, true),
    variables: { request }
  });

  const [undoPostNotInterested] = useUndoPostNotInterestedMutation({
    onCompleted: () => {
      toast.success("Undo Not interested");
    },
    onError,
    update: (cache) => updateCache(cache, false),
    variables: { request }
  });

  const handleTogglePublicationProfileNotInterested = async () => {
    if (notInterested) {
      return await undoPostNotInterested();
    }

    return await addPostNotInterested();
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
        handleTogglePublicationProfileNotInterested();
      }}
    >
      <div className="flex items-center space-x-2">
        {notInterested ? (
          <>
            <EyeIcon className="size-4" />
            <div>Undo Not interested</div>
          </>
        ) : (
          <>
            <EyeSlashIcon className="size-4" />
            <div>Not interested</div>
          </>
        )}
      </div>
    </MenuItem>
  );
};

export default NotInterested;
