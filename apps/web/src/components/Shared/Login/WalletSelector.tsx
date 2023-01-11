import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { KeyIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import onError from '@lib/onError';
import { Trans } from '@lingui/macro';
import { ERROR_MESSAGE } from 'data/constants';
import { useAuthenticateMutation, useChallengeLazyQuery, useUserProfilesLazyQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { USER } from 'src/tracking';
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi';

interface Props {
  setHasProfile: Dispatch<boolean>;
}

const WalletSelector: FC<Props> = ({ setHasProfile }) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowLoginFlow = useAuthStore((state) => state.setShowLoginFlow);
  const [loading, setLoading] = useState(false);

  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation();
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery();

  const handleSign = async () => {
    let keepModal = false;
    try {
      setLoading(true);
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
        keepModal = true;
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
      Analytics.track(USER.SIWL);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      if (!keepModal) {
        setShowLoginFlow(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {chain?.id === CHAIN_ID || !chain?.id ? (
          <Button
            disabled={loading}
            icon={
              loading ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />
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
            Analytics.track(USER.CHANGE_WALLET);
          }}
          className="text-sm underline flex items-center space-x-1"
        >
          <KeyIcon className="h-4 w-4" />
          <div>
            <Trans>Change wallet</Trans>
          </div>
        </button>
      </div>
      {(errorChallenge || errorAuthenticate || errorProfiles) && (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="w-5 h-5" />
          <div>{ERROR_MESSAGE}</div>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
