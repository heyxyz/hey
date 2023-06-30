import { Menu } from '@headlessui/react';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/solid';
import { PUBLICATION } from '@lenster/data/tracking';
import type {
  Publication,
  PublicationProfileBookmarkRequest
} from '@lenster/lens';
import {
  useAddPublicationProfileBookmarkMutation,
  useRemovePublicationProfileBookmarkMutation
} from '@lenster/lens';
import type { ApolloCache } from '@lenster/lens/apollo';
import { publicationKeyFields } from '@lenster/lens/apollo/lib';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import errorToast from '@lib/errorToast';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import clsx from 'clsx';
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

  const updateCache = (cache: ApolloCache<any>, bookmarked: boolean) => {
    const bookmarkedPublications = isMirror
      ? publication?.mirrorOf
      : publication;

    cache.modify({
      id: publicationKeyFields(bookmarkedPublications),
      fields: {
        bookmarked: () => bookmarked,
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
        Mixpanel.track(PUBLICATION.BOOKMARK, {
          publication_id: publication.id,
          bookmarked: true
        });
      },
      update: (cache) => updateCache(cache, true)
    });

  const [removePublicationProfileBookmark] =
    useRemovePublicationProfileBookmarkMutation({
      variables: { request },
      onError,
      onCompleted: () => {
        toast.success(t`Removed publication bookmark`);
        Mixpanel.track(PUBLICATION.BOOKMARK, {
          publication_id: publication.id,
          bookmarked: false
        });
      },
      update: (cache) => updateCache(cache, false)
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
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
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
