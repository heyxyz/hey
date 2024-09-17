import type {
  MirrorablePublication,
  PublicationBookmarkRequest
} from "@hey/lens";
import type { ApolloCache } from "@hey/lens/apollo";
import type { FC } from "react";

import { MenuItem } from "@headlessui/react";
import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { PUBLICATION } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import {
  useAddPublicationBookmarkMutation,
  useRemovePublicationBookmarkMutation
} from "@hey/lens";
import cn from "@hey/ui/cn";
import { useCounter, useToggle } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface BookmarkProps {
  publication: MirrorablePublication;
}

const Bookmark: FC<BookmarkProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const [hasBookmarked, toggleHasBookmarked] = useToggle(
    publication.operations.hasBookmarked
  );
  const [bookmarks, { decrement, increment }] = useCounter(
    publication.stats.bookmarks
  );

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasBookmarked: !hasBookmarked };
        }
      },
      id: cache.identify(publication)
    });
    cache.modify({
      fields: {
        bookmarks: () => (hasBookmarked ? bookmarks - 1 : bookmarks + 1)
      },
      id: cache.identify(publication.stats)
    });

    // Remove bookmarked publication from bookmarks feed
    if (pathname === "/bookmarks") {
      cache.evict({ id: cache.identify(publication) });
    }
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const request: PublicationBookmarkRequest = { on: publication.id };

  const [addPublicationBookmark] = useAddPublicationBookmarkMutation({
    onCompleted: () => {
      toast.success("Publication bookmarked!");
      Leafwatch.track(PUBLICATION.BOOKMARK, {
        publication_id: publication.id
      });
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
      Leafwatch.track(PUBLICATION.REMOVE_BOOKMARK, {
        publication_id: publication.id
      });
    },
    onError: (error) => {
      toggleHasBookmarked();
      increment();
      onError(error);
    },
    update: updateCache,
    variables: { request }
  });

  const togglePublicationProfileBookmark = async () => {
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
        togglePublicationProfileBookmark();
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
