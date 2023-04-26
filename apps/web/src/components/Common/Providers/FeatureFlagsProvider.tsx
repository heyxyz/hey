import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { IS_MAINNET, mainnetStaffs, testnetStaffs } from 'data';
import isGardener from 'lib/isGardener';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';

const growthbook = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: 'sdk-fDLRMwvpyh4Kq3b',
  decryptionKey: 'jVi/0sNZ9Fzt0WI8AsSaIg==',
  enableDevMode: false
});

interface FeatureFlagsProviderProps {
  children: ReactNode;
}

const FeatureFlagsProvider: FC<FeatureFlagsProviderProps> = ({ children }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    growthbook.loadFeatures();
  }, []);

  useEffect(() => {
    if (currentProfile?.id) {
      growthbook.setAttributes({
        id: `${IS_MAINNET ? 'mainnet' : 'testnet'}-${currentProfile.id}`,
        loggedIn: true,
        isGardener: IS_MAINNET ? isGardener(currentProfile.id) : false,
        isStaff: IS_MAINNET
          ? mainnetStaffs.includes(currentProfile.id)
          : testnetStaffs.includes(currentProfile.id)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>;
};

export default FeatureFlagsProvider;
