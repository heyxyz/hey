import { gql, useQuery } from '@apollo/client';
import { Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import { Mixpanel } from '@lib/mixpanel';
import Cookies from 'js-cookie';
import mixpanel from 'mixpanel-browser';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { FC, ReactNode, Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CHAIN_ID, MIXPANEL_API_HOST, MIXPANEL_TOKEN, STATIC_ASSETS } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import Loading from './Loading';

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true });

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    ignore_dnt: true,
    api_host: MIXPANEL_API_HOST
  });
}

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...ProfileFields
        isDefault
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

const SiteLayout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const setIsConnected = useAppPersistStore((state) => state.setIsConnected);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAppPersistStore((state) => state.setIsAuthenticated);
  const currentUser = useAppPersistStore((state) => state.currentUser);
  const setCurrentUser = useAppPersistStore((state) => state.setCurrentUser);

  const [mounted, setMounted] = useState<boolean>(false);
  const { address, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: address },
    skip: !isConnected,
    onCompleted: (data) => {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) => (!(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1));

      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);

      if (profiles.length === 0) {
        setCurrentUser(null);
      } else {
        setProfiles(profiles);
      }
    }
  });

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const currentUserAddress = currentUser?.ownedBy;
    setMounted(true);

    // Set mixpanel user id
    if (currentUser?.id) {
      Mixpanel.identify(currentUser.id);
      Mixpanel.people.set({
        address: currentUser?.ownedBy,
        handle: currentUser?.handle,
        $name: currentUser?.name ?? currentUser?.handle,
        $avatar: `https://avatar.tobi.sh/${currentUser?.handle}.png`
      });
    } else {
      Mixpanel.identify('0x00');
      Mixpanel.people.set({
        $name: 'Anonymous',
        $avatar: `${STATIC_ASSETS}/anon.jpeg`
      });
    }

    const logout = () => {
      setIsAuthenticated(false);
      setIsConnected(false);
      setCurrentUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('lenster.store');
      if (disconnect) {
        disconnect();
      }
    };

    if (
      refreshToken &&
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken !== 'undefined' &&
      currentUser &&
      chain?.id === CHAIN_ID
    ) {
      setIsAuthenticated(true);
    } else {
      if (isAuthenticated) {
        logout();
      }
    }

    if (isDisconnected) {
      if (disconnect) {
        disconnect();
      }
      setIsAuthenticated(false);
      setIsConnected(false);
    }

    if (currentUserAddress !== undefined && currentUserAddress !== address) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isAuthenticated, isDisconnected, address, chain, currentUser, disconnect, setCurrentUser]);

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
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {children}
        </div>
      </Suspense>
    </>
  );
};

export default SiteLayout;
