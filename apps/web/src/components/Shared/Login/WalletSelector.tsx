import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { KeyIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Errors } from '@hey/data/errors';
import { Localstorage } from '@hey/data/storage';
import { AUTH } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfileLazyQuery,
  useProfilesManagedQuery
} from '@hey/lens';
import getWalletDetails from '@hey/lib/getWalletDetails';
import { Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useIsMounted } from 'usehooks-ts';
import type { Connector } from 'wagmi';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSignMessage
} from 'wagmi';

import UserProfile from '../UserProfile';

interface WalletSelectorProps {
  setHasConnected?: Dispatch<SetStateAction<boolean>>;
  setHasProfile?: Dispatch<SetStateAction<boolean>>;
}

const WalletSelector: FC<WalletSelectorProps> = ({
  setHasConnected,
  setHasProfile
}) => {
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const isMounted = useIsMounted();
  const chain = useChainId();
  const {
    connectors,
    error,
    connectAsync,
    isLoading: isConnectLoading,
    pendingConnector
  } = useConnect({ chainId: CHAIN_ID });

  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const {
    data: profilesManaged,
    loading: profilesManagedLoading,
    error: profilesManagedError
  } = useProfilesManagedQuery({
    variables: { request: { for: address } },
    skip: !address
  });
  const [getUserProfile] = useProfileLazyQuery();

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected?.(true);
      }
      Leafwatch.track(AUTH.CONNECT_WALLET, {
        wallet: connector.name.toLowerCase()
      });
    } catch {}
  };

  const handleSign = async (id: string) => {
    let keepModal = false;
    try {
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { for: id, signedBy: address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });
      const accessToken = auth.data?.authenticate.accessToken;
      const refreshToken = auth.data?.authenticate.refreshToken;

      localStorage.setItem(Localstorage.AccessToken, accessToken);
      localStorage.setItem(Localstorage.RefreshToken, refreshToken);

      // Get authed profiles
      const { data: profile } = await getUserProfile({
        variables: { request: { forProfileId: id } }
      });

      if (!profile?.profile) {
        setHasProfile?.(false);
        keepModal = true;
      } else {
        const currentProfile = profile.profile;
        setCurrentProfile(currentProfile as Profile);
        setProfileId(currentProfile.id);
      }
      Leafwatch.track(AUTH.SIWL);
    } catch {
    } finally {
      setIsLoading(false);
      if (!keepModal) {
        setShowAuthModal(false);
      }
    }
  };

  return activeConnector?.id ? (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {chain === CHAIN_ID ? (
          <div>
            {profilesManaged?.profilesManaged.items.map((profile) => (
              <button key={profile.id} onClick={() => handleSign(profile.id)}>
                <UserProfile
                  linkToProfile={false}
                  showUserPreview={false}
                  profile={profile as Profile}
                />
              </button>
            ))}
          </div>
        ) : (
          <SwitchNetwork toChainId={CHAIN_ID} />
        )}
        <button
          onClick={() => {
            disconnect?.();
            Leafwatch.track(AUTH.CHANGE_WALLET);
          }}
          className="flex items-center space-x-1 text-sm underline"
        >
          <KeyIcon className="h-4 w-4" />
          <div>
            <Trans>Change wallet</Trans>
          </div>
        </button>
      </div>
      {errorChallenge || errorAuthenticate ? (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      {connectors
        .filter((connector) => {
          return isMobile ? connector.id !== 'injected' : true;
        })
        .map((connector) => {
          return (
            <button
              type="button"
              key={connector.id}
              className={cn(
                {
                  'hover:bg-gray-100 dark:hover:bg-gray-700':
                    connector.id !== activeConnector?.id
                },
                'flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none dark:border-gray-700'
              )}
              onClick={() => onConnect(connector)}
              disabled={
                isMounted()
                  ? !connector.ready || connector.id === activeConnector?.id
                  : false
              }
            >
              <span>
                {isMounted()
                  ? connector.id === 'injected'
                    ? t`Browser Wallet`
                    : getWalletDetails(connector.name).name
                  : getWalletDetails(connector.name).name}
                {isMounted() ? !connector.ready && ' (unsupported)' : ''}
              </span>
              <div className="flex items-center space-x-4">
                {isConnectLoading && pendingConnector?.id === connector.id ? (
                  <Spinner className="mr-0.5" size="xs" />
                ) : null}
                <img
                  src={getWalletDetails(connector.name).logo}
                  draggable={false}
                  className="h-6 w-6"
                  height={24}
                  width={24}
                  alt={connector.id}
                />
              </div>
            </button>
          );
        })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{error?.message ?? t`Failed to connect`}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
