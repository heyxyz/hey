import { Community } from '@generated/lenstertypes';
import { UsersIcon } from '@heroicons/react/outline';
import imagekitURL from '@lib/imagekitURL';
import nFormatter from '@lib/nFormatter';
import Link from 'next/link';
import React, { FC } from 'react';

interface Props {
  community: Community;
}

const CommunityProfile: FC<Props> = ({ community }) => {
  return (
    <div className="flex justify-between items-center">
      <Link href={`/communities/${community?.id}`}>
        <a href={`/communities/${community?.id}`}>
          <div className="flex items-center space-x-3">
            <img
              src={imagekitURL(
                community?.metadata?.cover?.original?.url
                  ? community?.metadata?.cover?.original?.url
                  : `https://avatar.tobi.sh/${community?.id}.png`,
                'avatar'
              )}
              className="w-16 h-16 bg-gray-200 rounded-xl border dark:border-gray-700/80"
              height={64}
              width={64}
              alt={community?.id}
            />
            <div className="space-y-1">
              <div className="">{community?.metadata?.name}</div>
              <div className="text-sm text-gray-500">{community?.metadata?.description}</div>
              {community?.stats?.totalAmountOfCollects !== 0 && (
                <div className="flex items-center space-x-1 text-sm">
                  <UsersIcon className="w-3 h-3" />
                  <div>
                    {nFormatter(community?.stats?.totalAmountOfCollects)}{' '}
                    {community?.stats?.totalAmountOfCollects === 1 ? 'member' : 'members'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default CommunityProfile;
