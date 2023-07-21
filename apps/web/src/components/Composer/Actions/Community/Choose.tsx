import { CheckCircleIcon } from '@heroicons/react/solid';
import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import getAvatar from '@lenster/lib/getAvatar';
import type { Community } from '@lenster/types/communities';
import { Image } from '@lenster/ui';
import axios from 'axios';
import type { Dispatch, FC } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import { useQuery } from 'wagmi';

interface ChooseProps {
  setShowModal: Dispatch<boolean>;
}

const Choose: FC<ChooseProps> = ({ setShowModal }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const selectedCommunity = usePublicationStore((state) => state.community);
  const setCommunity = usePublicationStore((state) => state.setCommunity);

  const fetchCommunities = async () => {
    try {
      const response = await axios(
        `${COMMUNITIES_WORKER_URL}/communities/get/${currentProfile?.id}/0`
      );

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading } = useQuery(
    ['communities', currentProfile?.id],
    () => fetchCommunities().then((res) => res)
  );

  if (isLoading) {
    return <div>Loading...</div>;
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
          <span className="flex items-center space-x-2">
            <Image
              className="h-10 w-10 rounded-lg border dark:border-gray-700"
              height={20}
              width={20}
              src={getAvatar(community)}
              alt={community.slug}
            />
            <div>
              <div className="truncate">{community.name ?? community.slug}</div>
              <div>{community.members_count} members</div>
            </div>
          </span>
          {community.id === selectedCommunity?.id && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Choose;
