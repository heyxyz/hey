import { Menu } from '@headlessui/react';
import { EyeOffIcon } from '@heroicons/react/outline';
import type {
  Publication,
  PublicationProfileNotInterestedRequest
} from '@lenster/lens';
import {
  useAddPublicationProfileNotInterestedMutation,
  useRemovePublicationProfileNotInterestedMutation
} from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import errorToast from '@lib/errorToast';
import clsx from 'clsx';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

interface NotInterestedProps {
  publication: Publication;
}

const NotInterested: FC<NotInterestedProps> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const request: PublicationProfileNotInterestedRequest = {
    profileId: currentProfile?.id,
    publicationId: publication.id
  };

  const [addPublicationProfileNotInterested] =
    useAddPublicationProfileNotInterestedMutation({
      variables: { request },
      onError: (error) => {
        errorToast(error);
      }
    });

  const [removePublicationProfileNotInterested] =
    useRemovePublicationProfileNotInterestedMutation({
      variables: { request },
      onError: (error) => {
        errorToast(error);
      }
    });

  const togglePublicationProfileNotInterested = async () => {
    if (publication.downvoted) {
      return await removePublicationProfileNotInterested();
    }

    return await addPublicationProfileNotInterested();
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
        togglePublicationProfileNotInterested();
      }}
    >
      <div className="flex items-center space-x-2">
        {publication.downvoted ? (
          <>
            <EyeOffIcon className="h-4 w-4" />
            <div>Undo Not Interested</div>
          </>
        ) : (
          <>
            <EyeOffIcon className="h-4 w-4" />
            <div>Not Interested</div>
          </>
        )}
      </div>
    </Menu.Item>
  );
};

export default NotInterested;
