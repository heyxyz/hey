import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { IS_MAINNET } from '@hey/data/constants';
import getInternalPreferences from '@hey/helpers/api/getInternalPreferences';
import { useQuery } from '@tanstack/react-query';
import useLensAuthData from 'src/hooks/useLensAuthData';

import FeatureFlags from './FeatureFlags';
import LeafwatchDetails from './LeafwatchDetails';
import ManagedProfiles from './ManagedProfiles';
import ProfileOverview from './ProfileOverview';
import ProfilePreferences from './ProfilePreferences';
import Rank from './Rank';

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  const lensAuthData = useLensAuthData();

  const { data: preferences } = useQuery({
    queryFn: () => getInternalPreferences(profile.id, lensAuthData),
    queryKey: ['getInternalPreferences', profile.id || '']
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
