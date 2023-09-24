import { XMarkIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { useDismissRecommendedProfilesMutation } from '@hey/lens';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';

interface DismissRecommendedProfileProps {
  profile: Profile;
  dismissSource?: string;
  dismissPosition?: number;
}

const DismissRecommendedProfile: FC<DismissRecommendedProfileProps> = ({
  profile,
  dismissSource,
  dismissPosition
}) => {
  const [dismissRecommendedProfile] = useDismissRecommendedProfilesMutation({
    variables: { request: { profileIds: [profile.id] } },
    update: (cache) => {
      cache.evict({ id: cache.identify(profile) });
    }
  });

  const handleDismiss = async () => {
    await dismissRecommendedProfile();
    Leafwatch.track(PROFILE.DISMISS_RECOMMENDED_PROFILE, {
      ...(dismissSource && { dismiss_source: dismissSource }),
      ...(dismissPosition && { dismiss_position: dismissPosition }),
      dismiss_target: profile.id
    });
  };

  return (
    <button onClick={handleDismiss}>
      <XMarkIcon className="h-4 w-4 text-gray-500" />
    </button>
  );
};

export default DismissRecommendedProfile;
