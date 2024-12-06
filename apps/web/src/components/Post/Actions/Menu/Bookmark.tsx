import type { ApolloCache } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import {
  type Post,
  useBookmarkPostMutation,
  useUndoBookmarkPostMutation
} from "@hey/indexer";
import cn from "@hey/ui/cn";
import { useCounter, useToggle } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import type { FC } from "react";
import { toast } from "react-hot-toast";

interface BookmarkProps {
  post: Post;
}

const Bookmark: FC<BookmarkProps> = ({ post }) => {
  const { pathname } = useRouter();
  const [hasBookmarked, toggleHasBookmarked] = useToggle(
    post.operations?.hasBookmarked
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

  const [bookmarkPost] = useBookmarkPostMutation({
    onCompleted: () => {
      toast.success("Publication bookmarked!");
    },
    onError: (error) => {
      toggleHasBookmarked();
      decrement();
      onError(error);
    },
    update: updateCache,
    variables: { request: { post: post.id } }
  });

  const [undoBookmarkPost] = useUndoBookmarkPostMutation({
    onCompleted: () => {
      toast.success("Removed publication bookmark!");
    },
    onError: (error) => {
      toggleHasBookmarked();
      increment();
      onError(error);
    },
    update: updateCache,
    variables: { request: { post: post.id } }
  });

  const handleTogglePublicationProfileBookmark = async () => {
    toggleHasBookmarked();

    if (hasBookmarked) {
      decrement();
      return await undoBookmarkPost();
    }

    increment();
    return await bookmarkPost();
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
