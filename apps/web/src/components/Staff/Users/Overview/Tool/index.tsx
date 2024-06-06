import type { Profile } from '@good/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { IS_MAINNET } from '@good/data/constants';
import getPreferences from '@good/helpers/api/getPreferences';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';

import FeatureFlags from './FeatureFlags';
import LeafwatchDetails from './LeafwatchDetails';
import ManagedProfiles from './ManagedProfiles';
import OnchainIdentities from './OnchainIdentities';
import ProfileOverview from './ProfileOverview';
import ProfilePreferences from './ProfilePreferences';
import Rank from './Rank';

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  const { data: preferences } = useQuery({
    queryFn: () => getPreferences(profile.id, getAuthApiHeaders()),
    queryKey: ['getPreferences', profile.id || '']
  });

  return (
    <div>
      <UserProfile
        hideFollowButton
        hideUnfollowButton
        isBig
        linkToProfile
        profile={profile}
        showBio
        showUserPreview={false}
      />
      <ProfileOverview profile={profile} />
      {preferences ? <ProfilePreferences preferences={preferences} /> : null}
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
