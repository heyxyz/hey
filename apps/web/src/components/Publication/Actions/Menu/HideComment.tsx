import type {
  AnyPublication,
  HideCommentRequest,
  UnhideCommentRequest
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import type { FC } from 'react';

import { useHiddenCommentFeedStore } from '@components/Publication';
import { Menu } from '@headlessui/react';
import { CheckCircleIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { useHideCommentMutation, useUnhideCommentMutation } from '@hey/lens';
import cn from '@hey/ui/cn';
import { toast } from 'react-hot-toast';
import errorToast from 'src/helpers/errorToast';
import { Leafwatch } from 'src/helpers/leafwatch';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface HideCommentProps {
  publication: AnyPublication;
}

const HideComment: FC<HideCommentProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const { showHiddenComments } = useHiddenCommentFeedStore();

  const request: HideCommentRequest | UnhideCommentRequest = {
    for: publication.id
  };

  const updateCache = (cache: ApolloCache<any>) => {
    cache.evict({ id: cache.identify(publication) });
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
    update: updateCache,
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
    update: updateCache,
    variables: { request }
  });

  const canHideComment = currentProfile?.id !== targetPublication?.by?.id;

  if (!canHideComment) {
    return null;
  }

  const toggleHideComment = async () => {
    if (showHiddenComments) {
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
        {showHiddenComments ? (
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
