import { Menu } from '@headlessui/react';
import { EyeOffIcon } from '@heroicons/react/outline';
import type { Publication, PublicationDownvoteRequest } from '@lenster/lens';
import {
  useAddPublicationDownvoteMutation,
  useRemovePublicationDownvoteMutation
} from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import errorToast from '@lib/errorToast';
import clsx from 'clsx';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

interface SeeLessProps {
  publication: Publication;
}

const SeeLess: FC<SeeLessProps> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const request: PublicationDownvoteRequest = {
    profileId: currentProfile?.id,
    publicationId: publication.id
  };

  const [addPublicationDownVote] = useAddPublicationDownvoteMutation({
    variables: { request },
    onError: (error) => {
      errorToast(error);
    }
  });

  const [removePublicationDownVote] = useRemovePublicationDownvoteMutation({
    variables: { request },
    onError: (error) => {
      errorToast(error);
    }
  });

  const togglePublicationDownVote = async () => {
    if (publication.downvoted) {
      return await removePublicationDownVote();
    }

    return await addPublicationDownVote();
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
        togglePublicationDownVote();
      }}
    >
      <div className="flex items-center space-x-2">
        <EyeOffIcon className="h-4 w-4" />
        <div>See Less</div>
      </div>
    </Menu.Item>
  );
};

export default SeeLess;
