import type { Profile } from '@good/lens';
import type { FC } from 'react';

import MetaDetails from '@components/Shared/MetaDetails';
import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import { APP_NAME, GOOD_API_URL } from '@good/data/constants';
import formatAddress from '@good/helpers/formatAddress';
import getFollowModule from '@good/helpers/getFollowModule';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

interface ProfileOverviewProps {
  profile: Profile;
}

const ProfileOverview: FC<ProfileOverviewProps> = ({ profile }) => {
  const getHaveUsedGood = async () => {
    try {
      const response = await axios.get(
        `${GOOD_API_URL}/internal/leafwatch/profile/haveUsedGood`,
        { headers: getAuthApiHeaders(), params: { id: profile.id } }
      );

      return response.data.haveUsedGood;
    } catch {
      return false;
    }
  };

  const { data: haveUsedGood } = useQuery({
    queryFn: getHaveUsedGood,
    queryKey: ['getHaveUsedGood', profile.id]
  });

  return (
    <>
      <div className="divider my-5 border-dashed border-yellow-600" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <div className="text-lg font-bold">Profile Overview</div>
      </div>
      <div className="mt-3 space-y-2">
        {haveUsedGood ? (
          <MetaDetails
            icon={
              <img
                alt="Logo"
                className="size-4"
                height={16}
                src="/logo.png"
                width={16}
              />
            }
          >
            Have used {APP_NAME}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HashtagIcon className="ld-text-gray-500 size-4" />}
          title="Profile ID"
          value={profile.id}
        >
          {profile.id}
        </MetaDetails>
        <MetaDetails
          icon={<BanknotesIcon className="ld-text-gray-500 size-4" />}
          title="Address"
          value={profile.ownedBy.address}
        >
          {formatAddress(profile.ownedBy.address)}
        </MetaDetails>
        {profile?.followNftAddress ? (
          <MetaDetails
            icon={<PhotoIcon className="ld-text-gray-500 size-4" />}
            title="NFT address"
            value={profile.followNftAddress.address}
          >
            {formatAddress(profile.followNftAddress.address)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 size-4" />}
          title="Has Lens Manager"
        >
          {profile.signless ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 size-4" />}
          title="Gas sponsored"
        >
          {profile.sponsor ? (
            <CheckCircleIcon className="size-4 text-green-500" />
          ) : (
            <XCircleIcon className="size-4 text-red-500" />
          )}
        </MetaDetails>
        <MetaDetails
          icon={<IdentificationIcon className="ld-text-gray-500 size-4" />}
          title="Follow module"
        >
          {getFollowModule(profile?.followModule?.__typename).description}
        </MetaDetails>
        {profile?.metadata?.rawURI ? (
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 size-4" />}
            title="Metadata"
            value={profile.metadata.rawURI}
          >
            <Link
              href={profile.metadata.rawURI}
              rel="noreferrer"
              target="_blank"
            >
              Open
            </Link>
          </MetaDetails>
        ) : null}
        <div className="pt-2">
          <P2PRecommendation profile={profile} />
        </div>
      </div>
    </>
  );
};

export default ProfileOverview;
