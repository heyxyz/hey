import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { mainnetStaffs } from 'data';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useFingerprintStore } from 'src/store/fingerprint';

const growthbook = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: 'sdk-fDLRMwvpyh4Kq3b',
  enableDevMode: false
});

interface FeatureFlagsProviderProps {
  children: ReactNode;
}

const FeatureFlagsProvider: FC<FeatureFlagsProviderProps> = ({ children }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const fingerprint = useFingerprintStore((state) => state.fingerprint);

  useEffect(() => {
    growthbook.loadFeatures();
  }, []);

  useEffect(() => {
    if (currentProfile?.id && fingerprint) {
      growthbook.setAttributes({
        id: currentProfile?.id,
        deviceId: fingerprint,
        loggedIn: true,
        isStaff: mainnetStaffs.includes(currentProfile?.id)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>;
};

export default FeatureFlagsProvider;
