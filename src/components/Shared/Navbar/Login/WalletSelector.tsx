import { useLazyQuery, useMutation } from '@apollo/client';
import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useIsMounted from '@components/utils/hooks/useIsMounted';
import { AuthenticateDocument, ChallengeDocument, UserProfilesDocument } from '@generated/types';
import { XCircleIcon } from '@heroicons/react/solid';
import getWalletLogo from '@lib/getWalletLogo';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import clsx from 'clsx';
import type { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID, ERROR_MESSAGE } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { USER } from 'src/tracking';
import type { Connector } from 'wagmi';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';

interface Props {
  setHasConnected: Dispatch<boolean>;
  setHasProfile: Dispatch<boolean>;
}

const WalletSelector: FC<Props> = ({ setHasConnected, setHasProfile }) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { mounted } = useIsMounted();
  const { chain } = useNetwork();
  const { connectors, error, connectAsync } = useConnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge, loading: challengeLoading }] = useLazyQuery(
    ChallengeDocument,
    { fetchPolicy: 'no-cache' }
  );
  const [authenticate, { error: errorAuthenticate, loading: authLoading }] =
    useMutation(AuthenticateDocument);
  const [getProfiles, { error: errorProfiles, loading: profilesLoading }] =
    useLazyQuery(UserProfilesDocument);

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected(true);
      }
      Mixpanel.track(`Connect with ${connector.name.toLowerCase()}`);
    } catch {}
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
      localStorage.setItem('accessToken', auth.data?.authenticate.accessToken);
      localStorage.setItem('refreshToken', auth.data?.authenticate.refreshToken);

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address }
      });

      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false);
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
      }
      Mixpanel.track(USER.SIWL);
    } catch {}
  };

  const isLoading = signLoading || challengeLoading || authLoading || profilesLoading;

  return activeConnector?.id ? (
    <div className="space-y-3">
      {chain?.id === CHAIN_ID ? (
        <Button
          size="lg"
          disabled={isLoading}
          icon={
            isLoading ? (
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
