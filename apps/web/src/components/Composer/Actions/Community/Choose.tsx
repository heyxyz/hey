import { CheckCircleIcon } from '@heroicons/react/solid';
import getAvatar from '@lenster/lib/getAvatar';
import humanize from '@lenster/lib/humanize';
import type { Community } from '@lenster/types/communities';
import { Image } from '@lenster/ui';
import fetchCommunities from '@lib/communities/fetchCommunities';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type { Dispatch, FC } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';

interface ChooseProps {
  setShowModal: Dispatch<boolean>;
}

const Choose: FC<ChooseProps> = ({ setShowModal }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const selectedCommunity = usePublicationStore((state) => state.community);
  const setCommunity = usePublicationStore((state) => state.setCommunity);

  const { data, isLoading } = useQuery(
    ['communities', currentProfile?.id],
    () => fetchCommunities(currentProfile?.id).then((res) => res)
  );

  if (isLoading) {
    // TODO: Add loading state
    return <div>Loading...</div>;
  }

  if (!data) {
    // TODO: Add empty state
    return <div>No communities found</div>;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      {data.map((community: Community) => (
        <button
          key={community.id}
          type="button"
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => {
            setCommunity(community);
            setShowModal(false);
          }}
        >
          <div className="flex items-center space-x-2">
            <Image
              className="h-10 w-10 rounded-lg border dark:border-gray-700"
              height={20}
              width={20}
              src={getAvatar(community)}
              alt={community.slug}
            />
            <div className="flex flex-col items-start">
              <div
                className={clsx(
                  { 'font-bold': community.id === selectedCommunity?.id },
                  'truncate'
                )}
              >
                {community.name ?? community.slug}
              </div>
              <div className="text-sm font-bold">
                {humanize(community.members_count as number)} members
              </div>
            </div>
          </div>
          {community.id === selectedCommunity?.id && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Choose;
