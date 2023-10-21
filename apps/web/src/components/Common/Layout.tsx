import GlobalAlerts from '@components/Shared/GlobalAlerts';
import GlobalBanners from '@components/Shared/GlobalBanners';
import BottomNavigation from '@components/Shared/Navbar/BottomNavigation';
import type { Profile } from '@hey/lens';
import { useCurrentProfileQuery } from '@hey/lens';
import resetAuthData from '@hey/lib/resetAuthData';
import getIsAuthTokensAvailable from '@lib/getIsAuthTokensAvailable';
import getToastOptions from '@lib/getToastOptions';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppPersistStore } from 'src/store/useAppPersistStore';
import { useAppStore } from 'src/store/useAppStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useIsMounted, useUpdateEffect } from 'usehooks-ts';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import { useDisconnectXmtp } from '../../hooks/useXmtpClient';
import GlobalModals from '../Shared/GlobalModals';
import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const { currentProfile, setCurrentProfile } = useAppStore();
  const { profileId, setProfileId } = useAppPersistStore();
  const { loadingPreferences, resetPreferences } = usePreferencesStore();
  const {
    setLensHubOnchainSigNonce,
    setLensTokenHandleRegistryOnchainSigNonce,
    setLensPublicActProxyOnchainSigNonce
  } = useNonceStore();

  const isMounted = useIsMounted();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const disconnectXmtp = useDisconnectXmtp();

  const resetAuthState = () => {
    setProfileId(null);
    setCurrentProfile(null);
    resetPreferences();
  };

  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: profileId } },
    skip: !profileId,
    onCompleted: ({ profile, userSigNonces }) => {
      if (!profile) {
        return resetAuthState();
      }

      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
      setLensPublicActProxyOnchainSigNonce(
        userSigNonces.lensPublicActProxyOnchainSigNonce
      );
      setLensTokenHandleRegistryOnchainSigNonce(
        userSigNonces.lensTokenHandleRegistryOnchainSigNonce
      );
      setProfileId(profile.id);
    },
    onError: () => setProfileId(null)
  });

  const validateAuthentication = () => {
    const currentProfileAddress = currentProfile?.ownedBy.address;
    const isSwitchedAccount = currentProfileAddress !== address;
    const shouldLogout = !getIsAuthTokensAvailable();

    // If there are no auth data, clear and logout
    if (shouldLogout && profileId) {
      disconnectXmtp();
      resetAuthState();
      resetAuthData();
      disconnect?.();
    }
  };

  useUpdateEffect(() => {
    validateAuthentication();
  }, [address, chain, disconnect, profileId]);

  if (loading || loadingPreferences || !isMounted()) {
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
