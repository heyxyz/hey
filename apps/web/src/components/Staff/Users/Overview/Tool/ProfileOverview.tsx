import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import MetaDetails from '@components/Shared/MetaDetails';
import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import formatAddress from '@hey/helpers/formatAddress';
import { H5 } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ProfileOverviewProps {
  profile: Profile;
}

const ProfileOverview: FC<ProfileOverviewProps> = ({ profile }) => {
  const getHaveUsedHey = async () => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/haveUsedHey`,
        { headers: getAuthApiHeaders(), params: { id: profile.id } }
      );

      return response.data.haveUsedHey;
    } catch {
      return false;
    }
  };

  const { data: haveUsedHey } = useQuery({
    queryFn: getHaveUsedHey,
    queryKey: ['getHaveUsedHey', profile.id]
  });

  return (
    <>
      <div className="divider my-5 border-dashed border-yellow-600" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <H5>Profile Overview</H5>
      </div>
      <div className="mt-3 space-y-2">
        {haveUsedHey ? (
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
        <div className="pt-2">
          <P2PRecommendation profile={profile} />
        </div>
      </div>
    </>
  );
};

export default ProfileOverview;
