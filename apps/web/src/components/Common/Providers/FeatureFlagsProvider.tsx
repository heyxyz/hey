import { Growthbook } from '@lib/growthbook';
import { IS_MAINNET, mainnetStaffs, testnetStaffs } from '@lenster/data';
import isGardener from 'lib/isGardener';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';

Growthbook.init();

const FeatureFlagsProvider: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    if (currentProfile?.id) {
      Growthbook.setAttributes({
        id: `${IS_MAINNET ? 'mainnet' : 'testnet'}-${currentProfile.id}`,
        isGardener: IS_MAINNET ? isGardener(currentProfile.id) : false,
        isStaff: IS_MAINNET
          ? mainnetStaffs.includes(currentProfile.id)
          : testnetStaffs.includes(currentProfile.id),
        browser: window.navigator.userAgent
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return null;
};

export default FeatureFlagsProvider;
