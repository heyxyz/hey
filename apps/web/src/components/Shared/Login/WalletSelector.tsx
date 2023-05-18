import SwitchNetwork from '@components/Shared/SwitchNetwork';
import useIsMounted from '@components/utils/hooks/useIsMounted';
import { KeyIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import errorToast from '@lib/errorToast';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import Errors from 'data/errors';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useUserProfilesLazyQuery
} from 'lens';
import getWalletDetails from 'lib/getWalletDetails';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { AUTH } from 'src/tracking';
import { Button, Spinner } from 'ui';
import type { Connector } from 'wagmi';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage
} from 'wagmi';

interface WalletSelectorProps {
  setHasConnected: Dispatch<boolean>;
  setHasProfile: Dispatch<boolean>;
}

const WalletSelector: FC<WalletSelectorProps> = ({
  setHasConnected,
  setHasProfile
}) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);
  const [isLoading, setIsLoading] = useState(false);

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { mounted } = useIsMounted();
  const { chain } = useNetwork();
  const { connectors, error, connectAsync } = useConnect({ chainId: CHAIN_ID });
  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery();

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected(true);
      }
      Mixpanel.track(AUTH.CONNECT_WALLET, {
        wallet: connector.name.toLowerCase()
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSign = async () => {
    let keepModal = false;
    try {
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } }
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
        variables: { request: { address, signature } }
      });
      localStorage.setItem('accessToken', auth.data?.authenticate.accessToken);
      localStorage.setItem(
        'refreshToken',
        auth.data?.authenticate.refreshToken
      );

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address }
      });

      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false);
        keepModal = true;
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) =>
            a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
          );
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
      }
      Mixpanel.track(AUTH.SIWL);
    } catch (error) {
      console.error(error);
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
        {chain?.id === CHAIN_ID ? (
          <Button
            id="lenster-login"
            disabled={isLoading}
            icon={
              isLoading ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img
                  className="mr-0.5 h-4 w-4"
                  height={16}
                  width={16}
                  src="/lens.png"
                  alt="Lens Logo"
                />
              )
            }
            onClick={handleSign}
          >
            <Trans>Sign-In with Lens</Trans>
          </Button>
        ) : (
          <SwitchNetwork />
        )}
        <button
          onClick={() => {
            disconnect?.();
            Mixpanel.track(AUTH.CHANGE_WALLET);
          }}
          className="flex items-center space-x-1 text-sm underline"
        >
          <KeyIcon className="h-4 w-4" />
          <div>
            <Trans>Change wallet</Trans>
          </div>
        </button>
      </div>
      {(errorChallenge || errorAuthenticate || errorProfiles) && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      )}
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      {connectors.map((connector) => {
        return (
          <button
            id="metamask-button"
            type="button"
            key={connector.id}
            className={clsx(
              {
                'hover:bg-gray-100 dark:hover:bg-gray-700':
                  connector.id !== activeConnector?.id
              },
              'flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none dark:border-gray-700'
            )}
            onClick={() => onConnect(connector)}
            disabled={
              mounted
                ? !connector.ready || connector.id === activeConnector?.id
                : false
            }
          >
            <span>
              {mounted
                ? connector.id === 'injected'
                  ? t`Browser Wallet`
                  : getWalletDetails(connector.name).name
                : getWalletDetails(connector.name).name}
              {mounted ? !connector.ready && ' (unsupported)' : ''}
            </span>
            <img
              src={getWalletDetails(connector.name).logo}
              draggable={false}
              className="h-6 w-6"
              height={24}
              width={24}
              alt={connector.id}
            />
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
