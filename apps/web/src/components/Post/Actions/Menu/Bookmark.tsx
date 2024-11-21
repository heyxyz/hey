import type { ApolloCache } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type {
  MirrorablePublication,
  PublicationBookmarkRequest
} from "@hey/lens";
import {
  useAddPublicationBookmarkMutation,
  useRemovePublicationBookmarkMutation
} from "@hey/lens";
import cn from "@hey/ui/cn";
import { useCounter, useToggle } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface BookmarkProps {
  post: MirrorablePublication;
}

const Bookmark: FC<BookmarkProps> = ({ post }) => {
  const { pathname } = useRouter();
  const [hasBookmarked, toggleHasBookmarked] = useToggle(
    post.operations.hasBookmarked
  );
  const [bookmarks, { decrement, increment }] = useCounter(
    post.stats.bookmarks
  );

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasBookmarked: !hasBookmarked };
        }
      },
      id: cache.identify(post)
    });
    cache.modify({
      fields: {
        bookmarks: () => (hasBookmarked ? bookmarks - 1 : bookmarks + 1)
      },
      id: cache.identify(post.stats)
    });

    // Remove bookmarked post from bookmarks feed
    if (pathname === "/bookmarks") {
      cache.evict({ id: cache.identify(post) });
    }
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const request: PublicationBookmarkRequest = { on: post.id };

  const [addPublicationBookmark] = useAddPublicationBookmarkMutation({
    onCompleted: () => {
      toast.success("Publication bookmarked!");
      Leafwatch.track(POST.BOOKMARK, { postId: post.id });
    },
    onError: (error) => {
      toggleHasBookmarked();
      decrement();
      onError(error);
    },
    update: updateCache,
    variables: { request }
  });

  const [removePublicationBookmark] = useRemovePublicationBookmarkMutation({
    onCompleted: () => {
      toast.success("Removed publication bookmark!");
      Leafwatch.track(POST.REMOVE_BOOKMARK, { postId: post.id });
    },
    onError: (error) => {
      toggleHasBookmarked();
      increment();
      onError(error);
    },
    update: updateCache,
    variables: { request }
  });

  const handleTogglePublicationProfileBookmark = async () => {
    toggleHasBookmarked();

    if (hasBookmarked) {
      decrement();
      return await removePublicationBookmark();
    }

    increment();
    return await addPublicationBookmark();
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
        handleTogglePublicationProfileBookmark();
      }}
    >
      <div className="flex items-center space-x-2">
        {hasBookmarked ? (
          <>
            <BookmarkIconSolid className="size-4" />
            <div>Remove Bookmark</div>
          </>
        ) : (
          <>
            <BookmarkIconOutline className="size-4" />
            <div>Bookmark</div>
          </>
        )}
      </div>
    </MenuItem>
  );
};

export default Bookmark;
