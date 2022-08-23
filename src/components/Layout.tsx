import { gql, useQuery } from '@apollo/client';
import { Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import Cookies from 'js-cookie';
import mixpanel from 'mixpanel-browser';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CHAIN_ID, MIXPANEL_API_HOST, MIXPANEL_TOKEN } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import Loading from './Loading';
import Navbar from './Shared/Navbar';

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    ignore_dnt: true,
    api_host: MIXPANEL_API_HOST,
    batch_requests: false
  });
}

export const CURRENT_PROFILE_QUERY = gql`
  query CurrentProfile($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...ProfileFields
        isDefault
        dispatcher {
          canUseRelay
        }
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${ProfileFields}
`;

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const setIsConnected = useAppPersistStore((state) => state.setIsConnected);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAppPersistStore((state) => state.setIsAuthenticated);
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const [mounted, setMounted] = useState(false);
  const { address, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { loading } = useQuery(CURRENT_PROFILE_QUERY, {
    variables: { ownedBy: address },
    skip: !isConnected && !isAuthenticated,
    onCompleted: (data) => {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) => (!(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1));

      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);

      if (profiles.length === 0) {
        setProfileId(null);
      } else {
        const selectedUser = profiles.find((profile) => profile.id === profileId);
        setProfiles(profiles);
        setCurrentProfile(selectedUser as Profile);
      }
    }
  });

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const hasAuthTokens = accessToken !== 'undefined' && refreshToken !== 'undefined';
    const currentProfileAddress = currentProfile?.ownedBy;
    const hasSameAddress = currentProfileAddress !== undefined && currentProfileAddress !== address;

    if (
      (hasSameAddress || // If the current address is not the same as the profile address
        chain?.id !== CHAIN_ID || // If the user is not on the correct chain
        isDisconnected || // If the user is disconnected from the wallet
        !profileId || // If the user has no profile
        !hasAuthTokens) && // If the user has no auth tokens
      isAuthenticated // If the user is authenticated
    ) {
      setIsAuthenticated(false);
      setIsConnected(false);
      setCurrentProfile(null);
      setProfileId(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('lenster.store');
      disconnect();
    }

    // Set mounted state to true after the first render
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected, address, chain, currentProfile, disconnect, setCurrentProfile]);

  const toastOptions = {
    style: {
      background: resolvedTheme === 'dark' ? '#18181B' : '',
      color: resolvedTheme === 'dark' ? '#fff' : ''
    },
    success: {
      className: 'border border-green-500',
      iconTheme: {
        primary: '#10B981',
        secondary: 'white'
      }
    },
    error: {
      className: 'border border-red-500',
      iconTheme: {
        primary: '#EF4444',
        secondary: 'white'
      }
    },
    loading: { className: 'border border-gray-300' }
  };

  if (loading || !mounted) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta name="theme-color" content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'} />
      </Head>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
