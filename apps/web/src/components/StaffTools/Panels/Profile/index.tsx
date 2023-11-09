import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { APP_NAME, IS_MAINNET, STATS_WORKER_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import getFollowModule from '@hey/lib/getFollowModule';
import { Card } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { type FC } from 'react';

import MetaDetails from '../MetaDetails';
import Access from './Access';
import ProfileDetails from './ProfileDetails';
import Rank from './Rank';

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  const getHaveUsedHey = async () => {
    try {
      const response = await axios.get(`${STATS_WORKER_URL}/haveUsedHey`, {
        params: { id: profile.id }
      });

      return response.data.haveUsedHey;
    } catch (error) {
      return false;
    }
  };

  const { data: haveUsedHey } = useQuery({
    queryKey: ['getHaveUsedHey', profile.id],
    queryFn: getHaveUsedHey
  });

  return (
    <Card
      as="aside"
      className="mt-5 border-yellow-400 !bg-yellow-300/20 p-5"
      forceRounded
    >
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Staff tool</div>
      </div>
      <div className="mt-3 space-y-2">
        {haveUsedHey ? (
          <MetaDetails
            icon={
              <img
                className="h-4 w-4"
                height={16}
                width={16}
                src="/logo.png"
                alt="Logo"
              />
            }
            value={profile.id}
          >
            Have used {APP_NAME}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HashtagIcon className="ld-text-gray-500 h-4 w-4" />}
          value={profile.id}
          title="Profile ID"
        >
          {profile.id}
        </MetaDetails>
        <MetaDetails
          icon={<BanknotesIcon className="ld-text-gray-500 h-4 w-4" />}
          value={profile.ownedBy.address}
          title="Address"
        >
          {formatAddress(profile.ownedBy.address)}
        </MetaDetails>
        {profile?.followNftAddress ? (
          <MetaDetails
            icon={<PhotoIcon className="ld-text-gray-500 h-4 w-4" />}
            value={profile.followNftAddress.address}
            title="NFT address"
          >
            {formatAddress(profile.followNftAddress.address)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 h-4 w-4" />}
          value={profile.signless ? 'Yes' : 'No'}
          title="Has Lens Manager"
        >
          {profile.signless ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 h-4 w-4" />}
          value={profile.sponsor ? 'Yes' : 'No'}
          title="Gas sponsored"
        >
          {profile.sponsor ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<IdentificationIcon className="ld-text-gray-500 h-4 w-4" />}
          value={profile.id}
          title="Follow module"
        >
          {getFollowModule(profile?.followModule?.__typename).description}
        </MetaDetails>
        {profile?.metadata?.rawURI ? (
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 h-4 w-4" />}
            value={profile.metadata.rawURI}
            title="Metadata"
          >
            <Link
              href={profile.metadata.rawURI}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </Link>
          </MetaDetails>
        ) : null}
      </div>
      {IS_MAINNET ? (
        <>
          <ProfileDetails profile={profile} />
          <Rank profile={profile} />
          <Access profile={profile} />
        </>
      ) : null}
    </Card>
  );
};

export default ProfileStaffTool;
