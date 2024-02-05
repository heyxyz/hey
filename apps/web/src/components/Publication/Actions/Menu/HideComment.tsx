import type {
  AnyPublication,
  HideCommentRequest,
  UnhideCommentRequest
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { CheckCircleIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import { useHideCommentMutation, useUnhideCommentMutation } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { toast } from 'react-hot-toast';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface HideCommentProps {
  publication: AnyPublication;
}

const HideComment: FC<HideCommentProps> = ({ publication }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hidden = targetPublication.operations.isNotInterested;

  const request: HideCommentRequest | UnhideCommentRequest = {
    for: publication.id
  };

  const updateCache = (cache: ApolloCache<any>, hidden: boolean) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, isNotInterested: hidden };
        }
      },
      id: cache.identify(targetPublication)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [hideComment] = useHideCommentMutation({
    onCompleted: () => {
      toast.success('Comment hidden');
      Leafwatch.track(PUBLICATION.TOGGLE_HIDE_COMMENT, {
        hidden: true,
        publication_id: publication.id
      });
    },
    onError,
    update: (cache) => updateCache(cache, true),
    variables: { request }
  });

  const [unhideComment] = useUnhideCommentMutation({
    onCompleted: () => {
      toast.success('Comment unhidden');
      Leafwatch.track(PUBLICATION.TOGGLE_HIDE_COMMENT, {
        hidden: false,
        publication_id: publication.id
      });
    },
    onError,
    update: (cache) => updateCache(cache, false),
    variables: { request }
  });

  const canHideComment = currentProfile?.id !== targetPublication?.by?.id;

  if (!canHideComment) {
    return null;
  }

  const toggleHideComment = async () => {
    if (hidden) {
      return await unhideComment();
    }

    return await hideComment();
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
        toggleHideComment();
      }}
    >
      <div className="flex items-center space-x-2">
        {hidden ? (
          <>
            <CheckCircleIcon className="size-4" />
            <div>Unhide comment</div>
          </>
        ) : (
          <>
            <NoSymbolIcon className="size-4" />
            <div>Hide comment</div>
          </>
        )}
      </div>
    </Menu.Item>
  );
};

export default HideComment;
