import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { CURRENT_PROFILE_QUERY } from '@components/Layout';
import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { Profile } from '@generated/types';
import { XCircleIcon } from '@heroicons/react/solid';
import getWalletLogo from '@lib/getWalletLogo';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import React, { Dispatch, FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { COOKIE_CONFIG } from 'src/apollo';
import { CHAIN_ID, ERROR_MESSAGE } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { USER } from 'src/tracking';
import { Connector, useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';

const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

export const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

interface Props {
  setHasConnected: Dispatch<boolean>;
  setHasProfile: Dispatch<boolean>;
}

const WalletSelector: FC<Props> = ({ setHasConnected, setHasProfile }) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setIsConnected = useAppPersistStore((state) => state.setIsConnected);
  const setIsAuthenticated = useAppPersistStore((state) => state.setIsAuthenticated);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const [mounted, setMounted] = useState(false);
  const { chain } = useNetwork();
  const { connectors, error, connectAsync } = useConnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage({
    onError: (error) => {
      toast.error(error?.message);
    }
  });
  const [loadChallenge, { error: errorChallenge, loading: challengeLoading }] = useLazyQuery(
    CHALLENGE_QUERY,
    {
      fetchPolicy: 'no-cache'
    }
  );
  const [authenticate, { error: errorAuthenticate, loading: authLoading }] =
    useMutation(AUTHENTICATE_MUTATION);
  const [getProfiles, { error: errorProfiles, loading: profilesLoading }] =
    useLazyQuery(CURRENT_PROFILE_QUERY);

  useEffect(() => setMounted(true), []);

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected(true);
      }
      Mixpanel.track(`Connect with ${connector.name.toLowerCase()}`);
    } catch (error) {}
  };

  const handleSign = async () => {
    try {
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(ERROR_MESSAGE);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } }
      });
      Cookies.set('accessToken', auth.data.authenticate.accessToken, COOKIE_CONFIG);
      Cookies.set('refreshToken', auth.data.authenticate.refreshToken, COOKIE_CONFIG);

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address }
      });
      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false);
      } else {
        const profiles: Profile[] = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
          ?.sort((a: Profile, b: Profile) => (!(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1));
        setIsAuthenticated(true);
        setProfiles(profiles);
        setCurrentProfile(profiles[0]);
        setProfileId(profiles[0].id);
      }
      setIsConnected(true);
      Mixpanel.track(USER.SIWL, { result: 'success' });
    } catch (error) {
      console.log(error);
    }
  };

  return activeConnector?.id ? (
    <div className="space-y-3">
      {chain?.id === CHAIN_ID ? (
        <Button
          size="lg"
          disabled={signLoading || challengeLoading || authLoading || profilesLoading}
          icon={
            signLoading || challengeLoading || authLoading || profilesLoading ? (
              <Spinner className="mr-0.5" size="xs" />
            ) : (
              <img className="mr-1 w-5 h-5" height={20} width={20} src="/lens.png" alt="Lens Logo" />
            )
          }
          onClick={handleSign}
        >
          Sign-In with Lens
        </Button>
      ) : (
        <SwitchNetwork />
      )}
      {(errorChallenge || errorAuthenticate || errorProfiles) && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{ERROR_MESSAGE}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="inline-block overflow-hidden space-y-3 w-full text-left align-middle transition-all transform">
      {connectors.map((connector) => {
        return (
          <button
            type="button"
            key={connector.id}
            className={clsx(
              {
                'hover:bg-gray-100 dark:hover:bg-gray-700': connector.id !== activeConnector?.id
              },
              'w-full flex items-center space-x-2.5 justify-center px-4 py-3 overflow-hidden rounded-xl border dark:border-gray-700/80 outline-none'
            )}
            onClick={() => onConnect(connector)}
            disabled={mounted ? !connector.ready || connector.id === activeConnector?.id : false}
          >
            <span className="flex justify-between items-center w-full">
              {mounted ? (connector.id === 'injected' ? 'Browser Wallet' : connector.name) : connector.name}
              {mounted ? !connector.ready && ' (unsupported)' : ''}
            </span>
            <img
              src={getWalletLogo(connector.name)}
              draggable={false}
              className="w-6 h-6"
              height={24}
              width={24}
              alt={connector.id}
            />
          </button>
        );
      })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{error?.message ?? 'Failed to connect'}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
