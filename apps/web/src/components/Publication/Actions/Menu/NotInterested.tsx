import type { ApolloCache } from '@hey/lens/apollo';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import {
  type AnyPublication,
  type PublicationNotInterestedRequest,
  useAddPublicationNotInterestedMutation,
  useUndoPublicationNotInterestedMutation
} from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { toast } from 'react-hot-toast';

interface NotInterestedProps {
  publication: AnyPublication;
}

const NotInterested: FC<NotInterestedProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const notInterested = targetPublication.operations.isNotInterested;

  const request: PublicationNotInterestedRequest = {
    on: publication.id
  };

  const updateCache = (cache: ApolloCache<any>, notInterested: boolean) => {
    cache.modify({
      fields: {
        operations: (existingValue) => {
          return { ...existingValue, isNotInterested: notInterested };
        }
      },
      id: cache.identify(targetPublication)
    });
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [addPublicationNotInterested] = useAddPublicationNotInterestedMutation({
    onCompleted: () => {
      toast.success('Marked as not Interested');
      Leafwatch.track(PUBLICATION.TOGGLE_NOT_INTERESTED, {
        not_interested: true,
        publication_id: publication.id
      });
    },
    onError,
    update: (cache) => updateCache(cache, true),
    variables: { request }
  });

  const [undoPublicationNotInterested] =
    useUndoPublicationNotInterestedMutation({
      onCompleted: () => {
        toast.success('Undo Not interested');
        Leafwatch.track(PUBLICATION.TOGGLE_NOT_INTERESTED, {
          not_interested: false,
          publication_id: publication.id
        });
      },
      onError,
      update: (cache) => updateCache(cache, false),
      variables: { request }
    });

  const togglePublicationProfileNotInterested = async () => {
    if (notInterested) {
      return await undoPublicationNotInterested();
    }

    return await addPublicationNotInterested();
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
        togglePublicationProfileNotInterested();
      }}
    >
      <div className="flex items-center space-x-2">
        {notInterested ? (
          <>
            <EyeIcon className="size-4" />
            <div>Undo Not interested</div>
          </>
        ) : (
          <>
            <EyeSlashIcon className="size-4" />
            <div>Not interested</div>
          </>
        )}
      </div>
    </Menu.Item>
  );
};

export default NotInterested;
