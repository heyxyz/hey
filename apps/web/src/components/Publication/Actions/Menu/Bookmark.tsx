import { Menu } from '@headlessui/react';
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/solid';
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
import clsx from 'clsx';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

interface BookmarkProps {
  publication: Publication;
}

const Bookmark: FC<BookmarkProps> = ({ publication }) => {
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
    cache.modify({
      id: publicationKeyFields(isMirror ? publication?.mirrorOf : publication),
      fields: { bookmarked: () => bookmarked }
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationProfileBookmark] =
    useAddPublicationProfileBookmarkMutation({
      variables: { request },
      onError,
      update: (cache) => updateCache(cache, true)
    });

  const [removePublicationProfileBookmark] =
    useRemovePublicationProfileBookmarkMutation({
      variables: { request },
      onError,
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
