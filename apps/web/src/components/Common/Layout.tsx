import type { Profile } from '@hey/lens';
import { useCurrentProfileQuery } from '@hey/lens';
import { type FC, type ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import { useEffectOnce, useIsMounted } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useDisconnect } from 'wagmi';

import GlobalAlerts from '@/components/Shared/GlobalAlerts';
import GlobalBanners from '@/components/Shared/GlobalBanners';
import BottomNavigation from '@/components/Shared/Navbar/BottomNavigation';
import { useTheme } from '@/hooks/theme';
import getCurrentSession from '@/lib/getCurrentSession';
import getToastOptions from '@/lib/getToastOptions';
import { useNonceStore } from '@/store/non-persisted/useNonceStore';
import { usePreferencesStore } from '@/store/non-persisted/usePreferencesStore';
import { useProStore } from '@/store/non-persisted/useProStore';
import { hydrateAuthTokens, signOut } from '@/store/persisted/useAuthStore';
import { useFeatureFlagsStore } from '@/store/persisted/useFeatureFlagsStore';
import useProfileStore from '@/store/persisted/useProfileStore';

import GlobalModals from '../Shared/GlobalModals';
import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setCurrentProfile = useProfileStore((state) => state.setCurrentProfile);
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );
  const resetFeatureFlags = useFeatureFlagsStore(
    (state) => state.resetFeatureFlags
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const resetPro = useProStore((state) => state.resetPro);

  const isMounted = useIsMounted();
  const { disconnect } = useDisconnect();

  const { id: sessionProfileId } = getCurrentSession();

  const logout = () => {
    resetPreferences();
    resetFeatureFlags();
    resetPro();
    signOut();
    disconnect?.();
  };

  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: sessionProfileId } },
    skip: !sessionProfileId || isAddress(sessionProfileId),
    onCompleted: ({ profile, userSigNonces }) => {
      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
    }
  });

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens();
    if (!accessToken) {
      logout();
    }
  };

  useEffectOnce(() => {
    validateAuthentication();
  });

  const profileLoading = !currentProfile && loading;

  if (profileLoading || !isMounted()) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Helmet>
      <Toaster
        position="bottom-right"
        containerStyle={{ wordBreak: 'break-word' }}
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="flex min-h-screen flex-col pb-14 md:pb-0">
        <Navbar />
        <GlobalBanners />
        <BottomNavigation />
        {children}
      </div>
    </>
  );
};

export default Layout;
