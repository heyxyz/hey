import { IS_MAINNET } from '@lenster/data';
import isGardener from '@lenster/lib/isGardener';
import isLensTeamMember from '@lenster/lib/isLensTeamMember';
import isStaff from '@lenster/lib/isStaff';
import { Growthbook } from '@lib/growthbook';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';

Growthbook.init();

const FeatureFlagsProvider: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    if (currentProfile?.id) {
      const profileId = currentProfile.id;
      Growthbook.setAttributes({
        id: `${IS_MAINNET ? 'mainnet' : 'testnet'}-${profileId}`,
        isGardener: isGardener(profileId),
        isLensTeamMember: isLensTeamMember(profileId),
        isStaff: isStaff(profileId),
        browser: window.navigator.userAgent
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return null;
};

export default FeatureFlagsProvider;
