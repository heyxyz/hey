import { gql, useQuery } from '@apollo/client';
import useIsMounted from '@components/utils/hooks/useIsMounted';
import { Profile } from '@generated/types';
import { ProfileFields } from '@gql/ProfileFields';
import getToastOptions from '@lib/getToastOptions';
import resetAuthData from '@lib/resetAuthData';
import Cookies from 'js-cookie';
import mixpanel from 'mixpanel-browser';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { FC, ReactNode, useEffect } from 'react';
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

export const USER_PROFILES_QUERY = gql`
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
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { mounted } = useIsMounted();
  const { address, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');
  const hasAuthTokens =
    accessToken && refreshToken && accessToken !== 'undefined' && refreshToken !== 'undefined';

  const resetAuthState = () => {
    setProfileId(null);
    setCurrentProfile(null);
  };

  // Fetch current profiles and sig nonce owned by the wallet address
  const { loading } = useQuery(USER_PROFILES_QUERY, {
    variables: { ownedBy: address },
    skip: !hasAuthTokens && !profileId,
    onCompleted: (data) => {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) => (!(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1));

      if (!profiles.length) {
        resetAuthState();
      }

      const selectedUser = profiles.find((profile) => profile.id === profileId);
      setProfiles(profiles);
      setCurrentProfile(selectedUser as Profile);
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);
    }
  });

  useEffect(() => {
    const currentProfileAddress = currentProfile?.ownedBy;
    const hasSameAddress = currentProfileAddress !== undefined && currentProfileAddress !== address;
    const shouldLogout =
      hasSameAddress || // If the current address is not the same as the profile address
      chain?.id !== CHAIN_ID || // If the user is not on the correct chain
      isDisconnected || // If the user is disconnected from the wallet
      !hasAuthTokens; // If the user has no auth tokens

    // If there are no auth data, clear and logout
    if (shouldLogout && profileId) {
      resetAuthState();
      resetAuthData();
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected, address, chain, disconnect]);

  if (loading || !mounted) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <meta name="theme-color" content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'} />
      </Head>
      <Toaster position="bottom-right" toastOptions={getToastOptions(resolvedTheme)} />
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
