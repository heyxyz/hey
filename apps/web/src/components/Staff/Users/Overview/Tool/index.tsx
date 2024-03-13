import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import UserProfile from '@components/Shared/UserProfile';
import {
  BanknotesIcon,
  HandRaisedIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { APP_NAME, HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import getPreferences from '@hey/lib/api/getPreferences';
import formatAddress from '@hey/lib/formatAddress';
import getFollowModule from '@hey/lib/getFollowModule';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

import MetaDetails from '../../../../Shared/Staff/MetaDetails';
import FeatureFlags from './FeatureFlags';
import LeafwatchDetails from './LeafwatchDetails';
import ManagedProfiles from './ManagedProfiles';
import OnchainIdentities from './OnchainIdentities';
import Rank from './Rank';

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  const getHaveUsedHey = async () => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/internal/leafwatch/profile/haveUsedHey`,
        { params: { id: profile.id } }
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

  const { data: preferences } = useQuery({
    queryFn: () => getPreferences(profile.id, getAuthApiHeaders()),
    queryKey: ['fetchPreferences', profile.id || '']
  });

  return (
    <div>
      <UserProfile
        isBig
        linkToProfile
        profile={profile}
        showBio
        showUserPreview={false}
      />
      <div className="divider my-5 border-dashed border-yellow-600" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <div className="text-lg font-bold">Profile Overview</div>
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
          {profile.signless ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<HandRaisedIcon className="ld-text-gray-500 size-4" />}
          title="Gas sponsored"
        >
          {profile.sponsor ? 'Yes' : 'No'}
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
      <div className="divider my-5 border-dashed border-yellow-600" />
      <OnchainIdentities onchainIdentity={profile.onchainIdentity} />
      {IS_MAINNET ? (
        <>
          <LeafwatchDetails profileId={profile.id} />
          <div className="divider my-5 border-dashed border-yellow-600" />
          <Rank
            address={profile.ownedBy.address}
            handle={profile.handle?.localName}
            lensClassifierScore={profile.stats.lensClassifierScore || 0}
            profileId={profile.id}
          />
          <div className="divider my-5 border-dashed border-yellow-600" />
        </>
      ) : null}
      {preferences ? (
        <>
          <FeatureFlags
            features={preferences.features || []}
            profileId={profile.id}
          />
          <div className="divider my-5 border-dashed border-yellow-600" />
        </>
      ) : null}
      <ManagedProfiles address={profile.ownedBy.address} />
    </div>
  );
};

export default ProfileStaffTool;
