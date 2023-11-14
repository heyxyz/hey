import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import type { Profile } from '@hey/lens';
import { useCurrentProfileQuery } from '@hey/lens';
import getCurrentSession from '@lib/getCurrentSession';
import getToastOptions from '@lib/getToastOptions';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { type FC, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { hydrateAuthTokens, signOut } from 'src/store/useAuthPersistStore';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useProStore } from 'src/store/useProStore';
import { useEffectOnce, useIsMounted } from 'usehooks-ts';
import { isAddress } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';

import GlobalModals from '../Shared/GlobalModals';
import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const loadingPreferences = usePreferencesStore(
    (state) => state.loadingPreferences
  );
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences
  );
  const loadingFeatureFlags = useFeatureFlagsStore(
    (state) => state.loadingFeatureFlags
  );
  const resetFeatureFlags = useFeatureFlagsStore(
    (state) => state.resetFeatureFlags
  );
  const loadingPro = useProStore((state) => state.loadingPro);
  const resetPro = useProStore((state) => state.resetPro);

  const isMounted = useIsMounted();
  const { connector } = useAccount();
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
    onCompleted: ({ profile }) => {
      setCurrentProfile(profile as Profile);
    }
  });

  useEffectOnce(() => {
    // Listen for switch account in wallet and logout
    connector?.addListener('change', () => logout());
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

  if (
    loading ||
    loadingPreferences ||
    loadingFeatureFlags ||
    loadingPro ||
    !isMounted()
  ) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
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
