import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import PageMetatags from '@components/Shared/PageMetatags';
import { useCurrentProfileQuery } from '@hey/lens';
import { useIsClient } from '@uidotdev/usehooks';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import getCurrentSession from 'src/helpers/getCurrentSession';
import getToastOptions from 'src/helpers/getToastOptions';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { hydrateAuthTokens, signOut } from 'src/store/persisted/useAuthStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
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
  const { currentProfile, setCurrentProfile, setFallbackToCuratedFeed } =
    useProfileStore();
  const { resetPreferences } = usePreferencesStore();
  const { resetFeatureFlags } = useFeatureFlagsStore();
  const { setLensHubOnchainSigNonce } = useNonceStore();

  const isMounted = useIsClient();
  const { disconnect } = useDisconnect();

  const { id: sessionProfileId } = getCurrentSession();

  const logout = (reload = false) => {
    resetPreferences();
    resetFeatureFlags();
    signOut();
    disconnect?.();
    if (reload) {
      location.reload();
    }
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

  useEffect(() => {
    validateAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileLoading = !currentProfile && loading;

  if (profileLoading || !isMounted) {
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
