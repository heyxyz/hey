import { Menu } from '@headlessui/react';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import type { Publication, PublicationProfileBookmarkRequest } from '@hey/lens';
import {
  useAddPublicationProfileBookmarkMutation,
  useRemovePublicationProfileBookmarkMutation
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import { publicationKeyFields } from '@hey/lens/apollo/lib';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';

interface BookmarkProps {
  publication: Publication;
}

const Bookmark: FC<BookmarkProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const isMirror = publication.__typename === 'Mirror';
  const bookmarked = isMirror
    ? publication.mirrorOf.bookmarked
    : publication.bookmarked;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const request: PublicationProfileBookmarkRequest = {
    profileId: currentProfile?.id,
    publicationId: publication.id
  };

  const updateCache = (cache: ApolloCache<any>) => {
    const bookmarkedPublications = isMirror
      ? publication?.mirrorOf
      : publication;

    cache.modify({
      id: publicationKeyFields(bookmarkedPublications),
      fields: {
        bookmarked: (bookmarked) => !bookmarked,
        stats: (stats) => ({
          ...stats,
          totalBookmarks: bookmarked
            ? stats.totalBookmarks + 1
            : stats.totalBookmarks - 1
        })
      }
    });

    // Remove bookmarked publication from bookmarks feed
    if (pathname === '/bookmarks') {
      cache.evict({ id: publicationKeyFields(bookmarkedPublications) });
    }
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationProfileBookmark] =
    useAddPublicationProfileBookmarkMutation({
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

  const [removePublicationProfileBookmark] =
    useRemovePublicationProfileBookmarkMutation({
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
      return await removePublicationProfileBookmark();
    }

    return await addPublicationProfileBookmark();
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
