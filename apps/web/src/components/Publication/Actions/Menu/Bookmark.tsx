import { Menu } from '@headlessui/react';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@lenster/data/tracking';
import {
  type AnyPublication,
  type PublicationBookmarkRequest,
  useAddPublicationBookmarkMutation,
  useRemovePublicationBookmarkMutation
} from '@lenster/lens';
import type { ApolloCache } from '@lenster/lens/apollo';
import { publicationKeyFields } from '@lenster/lens/apollo/lib';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import cn from '@lenster/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';

interface BookmarkProps {
  publication: AnyPublication;
}

const Bookmark: FC<BookmarkProps> = ({ publication }) => {
  const { pathname } = useRouter();

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const bookmarked = targetPublication.operations.hasBookmarked;

  const request: PublicationBookmarkRequest = {
    on: publication.id
  };

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: publicationKeyFields(targetPublication),
      fields: {
        bookmarked: (bookmarked) => !bookmarked,
        stats: (stats) => ({
          ...stats,
          bookmarks: bookmarked ? stats.bookmarks + 1 : stats.bookmarks - 1
        })
      }
    });

    // Remove bookmarked publication from bookmarks feed
    if (pathname === '/bookmarks') {
      cache.evict({ id: publicationKeyFields(targetPublication) });
    }
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationBookmark] = useAddPublicationBookmarkMutation({
    variables: { request },
    onError,
    onCompleted: () => {
      toast.success(t`Publication bookmarked`);
      Leafwatch.track(PUBLICATION.TOGGLE_BOOKMARK, {
        publication_id: publication.id,
        bookmarked: true
      });
    },
    update: (cache) => updateCache(cache)
  });

  const [removePublicationBookmark] = useRemovePublicationBookmarkMutation({
    variables: { request },
    onError,
    onCompleted: () => {
      toast.success(t`Removed publication bookmark`);
      Leafwatch.track(PUBLICATION.TOGGLE_BOOKMARK, {
        publication_id: publication.id,
        bookmarked: false
      });
    },
    update: (cache) => updateCache(cache)
  });

  const togglePublicationProfileBookmark = async () => {
    if (bookmarked) {
      return await removePublicationBookmark();
    }

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
        {bookmarked ? (
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
