import { Menu } from '@headlessui/react';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import {
  type AnyPublication,
  type PublicationBookmarkRequest,
  useAddPublicationBookmarkMutation,
  useRemovePublicationBookmarkMutation
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useLocation } from 'react-router-dom';
import { type FC, useState } from 'react';
import { toast } from 'react-hot-toast';

interface BookmarkProps {
  publication: AnyPublication;
}

const Bookmark: FC<BookmarkProps> = ({ publication }) => {
  const location = useLocation();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [hasBookmarked, setHasBookmarked] = useState(
    targetPublication.operations.hasBookmarked
  );
  const [bookmarks, setBookmarks] = useState(targetPublication.stats.bookmarks);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: cache.identify(targetPublication),
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, hasBookmarked: !hasBookmarked };
        }
      }
    });
    cache.modify({
      id: cache.identify(targetPublication.stats),
      fields: {
        bookmarks: () => (hasBookmarked ? bookmarks - 1 : bookmarks + 1)
      }
    });

    // Remove bookmarked publication from bookmarks feed
    if (location.pathname === '/bookmarks') {
      cache.evict({ id: cache.identify(targetPublication) });
    }
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const request: PublicationBookmarkRequest = { on: targetPublication.id };

  const [addPublicationBookmark] = useAddPublicationBookmarkMutation({
    variables: { request },
    onError: (error) => {
      setHasBookmarked(!hasBookmarked);
      setBookmarks(bookmarks - 1);
      onError(error);
    },
    onCompleted: () => {
      toast.success('Publication bookmarked!');
      Leafwatch.track(PUBLICATION.TOGGLE_BOOKMARK, {
        publication_id: targetPublication.id,
        bookmarked: true
      });
    },
    update: updateCache
  });

  const [removePublicationBookmark] = useRemovePublicationBookmarkMutation({
    variables: { request },
    onError: (error) => {
      setHasBookmarked(!hasBookmarked);
      setBookmarks(bookmarks + 1);
      onError(error);
    },
    onCompleted: () => {
      toast.success('Removed publication bookmark!');
      Leafwatch.track(PUBLICATION.TOGGLE_BOOKMARK, {
        publication_id: targetPublication.id,
        bookmarked: false
      });
    },
    update: updateCache
  });

  const togglePublicationProfileBookmark = async () => {
    if (hasBookmarked) {
      setHasBookmarked(false);
      setBookmarks(bookmarks - 1);
      return await removePublicationBookmark();
    }

    setHasBookmarked(true);
    setBookmarks(bookmarks + 1);
    return await addPublicationBookmark();
  };

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
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
            <BookmarkIconSolid className="h-4 w-4" />
            <div>Remove Bookmark</div>
          </>
        ) : (
          <>
            <BookmarkIconOutline className="h-4 w-4" />
            <div>Bookmark</div>
          </>
        )}
      </div>
    </Menu.Item>
  );
};

export default Bookmark;
