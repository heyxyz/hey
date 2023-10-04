import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import {
  ACHIEVEMENTS_WORKER_URL,
  APP_NAME,
  IS_MAINNET
} from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import formatHandle from '@hey/lib/formatHandle';
import getFollowModule from '@hey/lib/getFollowModule';
import { Card } from '@hey/ui';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import type { FC } from 'react';

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
      const response = await axios.get(
        `${ACHIEVEMENTS_WORKER_URL}/haveUsedHey/${profile.id}`
      );

      return response.data.haveUsedHey;
    } catch (error) {
      return false;
    }
  };

  const { data: haveUsedHey } = useQuery(['haveUsedHey', profile.id], () =>
    getHaveUsedHey().then((res) => res)
  );

  return (
    <Card
      as="aside"
      className="mt-5 border-yellow-400 !bg-yellow-300/20 p-5"
      forceRounded
    >
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Staff tool</Trans>
        </div>
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
            value={formatHandle(profile?.handle)}
          >
            <Trans>Have used {APP_NAME}</Trans>
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HashtagIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile?.id}
          title={t`Profile ID`}
        >
          {profile?.id}
        </MetaDetails>
        <MetaDetails
          icon={<BanknotesIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile?.ownedBy}
          title={t`Address`}
        >
          {formatAddress(profile?.ownedBy)}
        </MetaDetails>
        {profile?.followNftAddress ? (
          <MetaDetails
            icon={<PhotoIcon className="lt-text-gray-500 h-4 w-4" />}
            value={profile?.followNftAddress}
            title={t`NFT address`}
          >
            {formatAddress(profile?.followNftAddress)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HandRaisedIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile.dispatcher?.canUseRelay ? 'Yes' : 'No'}
          title={t`Can use relay`}
        >
          {profile.dispatcher?.canUseRelay ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile.dispatcher?.sponsor ? 'Yes' : 'No'}
          title={t`Gas sponsored`}
        >
          {profile.dispatcher?.sponsor ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<IdentificationIcon className="lt-text-gray-500 h-4 w-4" />}
          value={formatHandle(profile?.handle)}
          title={t`Follow module`}
        >
          {getFollowModule(profile?.followModule?.__typename).description}
        </MetaDetails>
        <MetaDetails
          icon={<LinkIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile?.metadata}
          title={t`Metadata`}
        >
          <Link href={profile?.metadata ?? ''} target="_blank" rel="noreferrer">
            <Trans>Open</Trans>
          </Link>
        </MetaDetails>
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
