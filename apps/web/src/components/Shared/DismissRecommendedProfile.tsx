import type { Profile } from '@good/lens';
import type { FC } from 'react';

import { PROFILE } from '@good/data/tracking';
import { useDismissRecommendedProfilesMutation } from '@good/lens';
import { Leafwatch } from '@helpers/leafwatch';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DismissRecommendedProfileProps {
  profile: Profile;
}

const DismissRecommendedProfile: FC<DismissRecommendedProfileProps> = ({
  profile
}) => {
  const [dismissRecommendedProfile] = useDismissRecommendedProfilesMutation({
    update: (cache) => {
      cache.evict({ id: cache.identify(profile) });
    },
    variables: { request: { dismiss: [profile.id] } }
  });

  const handleDismiss = async () => {
    await dismissRecommendedProfile();
    Leafwatch.track(PROFILE.DISMISS_RECOMMENDED_PROFILE, {
      target: profile.id
    });
  };

  return (
    <button onClick={handleDismiss} type="reset">
      <XMarkIcon className="size-4 text-gray-500" />
    </button>
  );
};

export default DismissRecommendedProfile;
