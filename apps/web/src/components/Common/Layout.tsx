import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import PageMetatags from '@components/Shared/PageMetatags';
import { useCurrentProfileQuery } from '@hey/lens';
import getCurrentSession from '@lib/getCurrentSession';
import getToastOptions from '@lib/getToastOptions';
import { useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { hydrateAuthTokens, signOut } from 'src/store/persisted/useAuthStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce, useIsMounted } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useDisconnect } from 'wagmi';

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
  const setFallbackToCuratedFeed = useProfileStore(
    (state) => state.setFallbackToCuratedFeed
  );

  const isMounted = useIsMounted();
  const { disconnect } = useDisconnect();

  const { id: sessionProfileId } = getCurrentSession();

  const logout = (reload = false) => {
    resetPreferences();
    resetFeatureFlags();
    signOut();
    disconnect?.();
  };

  const { loading } = useCurrentProfileQuery({
    onCompleted: ({ profile, userSigNonces }) => {
      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);

      // If the user has no following, we should fallback to the curated feed
      if (profile?.stats.followers === 0) {
        setFallbackToCuratedFeed(true);
      }
    },
    onError: () => logout(true),
    skip: !sessionProfileId || isAddress(sessionProfileId),
    variables: { request: { forProfileId: sessionProfileId } }
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
      <PageMetatags />
      <Toaster
        containerStyle={{ wordBreak: 'break-word' }}
        position="bottom-right"
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
