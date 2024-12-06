import type { ApolloCache } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Post } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface NotInterestedProps {
  post: Post;
}

const NotInterested: FC<NotInterestedProps> = ({ post }) => {
  const notInterested = post.operations?.isNotInterested;

  const request: PublicationNotInterestedRequest = {
    on: post.id
  };

  const updateCache = (cache: ApolloCache<any>, notInterested: boolean) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, isNotInterested: notInterested };
        }
      },
      id: cache.identify(post)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationNotInterested] = useAddPublicationNotInterestedMutation({
    onCompleted: () => {
      toast.success("Marked as not Interested");
    },
    onError,
    update: (cache) => updateCache(cache, true),
    variables: { request }
  });

  const [undoPublicationNotInterested] =
    useUndoPublicationNotInterestedMutation({
      onCompleted: () => {
        toast.success("Undo Not interested");
      },
      onError,
      update: (cache) => updateCache(cache, false),
      variables: { request }
    });

  const handleTogglePublicationProfileNotInterested = async () => {
    if (notInterested) {
      return await undoPublicationNotInterested();
    }

    return await addPublicationNotInterested();
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
