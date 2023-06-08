import { ArrowRightIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import { Trans } from '@lingui/macro';
import Errors from 'data/errors';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useHasTxHashBeenIndexedQuery,
  useUserProfilesLazyQuery,
  useUserProfilesQuery
} from 'lens';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { AUTH } from 'src/tracking';
import { Button, Spinner } from 'ui';
import { useAccount, useSignMessage } from 'wagmi';

interface PendingProps {
  handle: string;
  txHash: string;
}

const Pending: FC<PendingProps> = ({ handle, txHash }) => {
  const { data, loading } = useHasTxHashBeenIndexedQuery({
    variables: { request: { txHash } },
    pollInterval: 1000
  });
  const { push } = useRouter();
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);
  const [authenticate] = useAuthenticateMutation();
  const [getProfiles] = useUserProfilesLazyQuery();
  const { address } = useAccount();

  //get profiles with the address
  const { data: userProfilesData } = useUserProfilesQuery({
    variables: { ownedBy: address },
    pollInterval: 1000
  });

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const { signMessageAsync } = useSignMessage({ onError });
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const handleSign = async () => {
    let keepModal = false;
    try {
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
      localStorage.setItem('refreshToken', auth.data?.authenticate.refreshToken);

      // Get authed profiles
      if (!userProfilesData?.profiles?.items?.length) {
        keepModal = true;
        console.error('No profiles with this address');
      } else {
        const profiles: any = userProfilesData?.profiles?.items
          ?.slice()
          ?.sort((a, b) => Number(a.id) - Number(b.id))
          ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
        keepModal = false;
      }
      Mixpanel.track(AUTH.SIWL);
    } catch (error: any) {
      console.error(error);
    } finally {
      if (!keepModal) {
        setShowAuthModal(false);
      }
      push(`/u/${handle}`);
    }
  };

  return (
    <div className="p-5 text-center font-bold">
      {loading ||
      (data?.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult' &&
        !data?.hasTxHashBeenIndexed.indexed) ? (
        <div className="space-y-3 text-white font-medium">
          <Spinner className="mx-auto" />
          <div>
            <Trans>Account creation in progress, please wait!</Trans>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-white font-medium">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
          <div className="pt-3">
            <Button
              className="mx-auto"
              icon={<ArrowRightIcon className="mr-1 h-4 w-4" />}
              onClick={handleSign}
            >
              <Trans>Go to profile</Trans>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;
