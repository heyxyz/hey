import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { useQuery } from '@tanstack/react-query';
import { GROWTHBOOK_KEY, IS_MAINNET, mainnetStaffs, testnetStaffs } from 'data';
import getIpInfo from 'lib/getIpInfo';
import isGardener from 'lib/isGardener';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';

const growthbook = new GrowthBook({
  clientKey: GROWTHBOOK_KEY,
  enableDevMode: false
});

interface FeatureFlagsProviderProps {
  children: ReactNode;
}

const FeatureFlagsProvider: FC<FeatureFlagsProviderProps> = ({ children }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data: ipInfoData } = useQuery(
    ['ipInfoData'],
    () => getIpInfo().then((res) => res),
    { enabled: Boolean(currentProfile?.id) }
  );

  useEffect(() => {
    if (currentProfile?.id && ipInfoData) {
      growthbook.loadFeatures();
      growthbook.setAttributes({
        id: `${IS_MAINNET ? 'mainnet' : 'testnet'}-${currentProfile.id}`,
        isGardener: IS_MAINNET ? isGardener(currentProfile.id) : false,
        isStaff: IS_MAINNET
          ? mainnetStaffs.includes(currentProfile.id)
          : testnetStaffs.includes(currentProfile.id),
        browser: window.navigator.userAgent,
        country: ipInfoData?.country ?? 'Unknown'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, ipInfoData]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
};

export default FeatureFlagsProvider;
