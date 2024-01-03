import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@hey/lens';
import type { Dispatch, FC, SetStateAction } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import {
  ArrowRightCircleIcon,
  KeyIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { APP_NAME, IS_MAINNET } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { AUTH } from '@hey/data/tracking';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@hey/lens';
import { Button, Card, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { signIn } from 'src/store/persisted/useAuthStore';
import { useAccount, useChainId, useDisconnect, useSignMessage } from 'wagmi';

import UserProfile from '../UserProfile';

interface WalletSelectorProps {
  setShowSignup: Dispatch<SetStateAction<boolean>>;
}

const WalletSelector: FC<WalletSelectorProps> = ({ setShowSignup }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { disconnect } = useDisconnect();
  const chain = useChainId();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const request: LastLoggedInProfileRequest | ProfileManagersRequest = {
    for: address
  };
  const { data: profilesManaged, loading: profilesManagedLoading } =
    useProfilesManagedQuery({
      skip: !address,
      variables: {
        lastLoggedInProfileRequest: request,
        profilesManagedRequest: request
      }
    });

  const handleSign = async (id?: string) => {
    try {
      setLoggingInProfileId(id || null);
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { ...(id && { for: id }), signedBy: address } }
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
      signIn({ accessToken, refreshToken });
      Leafwatch.track(AUTH.SIWL);
      location.reload();
    } catch {}
  };

  const allProfiles = profilesManaged?.profilesManaged.items || [];
  const lastLogin = profilesManaged?.lastLoggedInProfile;

  const remainingProfiles = lastLogin
    ? allProfiles.filter((profile) => profile.id !== lastLogin.id)
    : allProfiles;

  const profiles = lastLogin
    ? [lastLogin, ...remainingProfiles]
    : remainingProfiles;

  return (
    <div className="space-y-3">
      <div className="mb-5 space-y-1">
        <div className="text-xl font-bold">Please sign the message.</div>
        <div className="ld-text-gray-500 text-sm">
          {APP_NAME} uses this signature to verify that you're the owner of this
          address.
        </div>
      </div>
      <div className="space-y-2.5">
        {chain === CHAIN_ID ? (
          profilesManagedLoading ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              <div className="space-y-2 p-4 text-center text-sm font-bold">
                <Spinner className="mx-auto" size="sm" />
                <div>Loading profiles managed by you...</div>
              </div>
            </Card>
          ) : profiles.length > 0 ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              {profiles.map((profile) => (
                <div
                  className="flex items-center justify-between p-3"
                  key={profile.id}
                >
                  <UserProfile
                    linkToProfile={false}
                    profile={profile as Profile}
                    showUserPreview={false}
                  />
                  <Button
                    disabled={isLoading && loggingInProfileId === profile.id}
                    icon={
                      isLoading && loggingInProfileId === profile.id ? (
                        <Spinner size="xs" />
                      ) : (
                        <ArrowRightCircleIcon className="size-4" />
                      )
                    }
                    onClick={() => handleSign(profile.id)}
                  >
                    Login
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <div>
              <Button
                disabled={isLoading}
                icon={
                  isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <ArrowRightCircleIcon className="size-4" />
                  )
                }
                onClick={() => handleSign()}
              >
                Sign in with Lens
              </Button>
            </div>
          )
        ) : (
          <SwitchNetwork toChainId={CHAIN_ID} />
        )}
        {!IS_MAINNET && (
          <button
            className="flex items-center space-x-1 text-sm underline"
            onClick={() => {
              setShowSignup?.(true);
              Leafwatch.track(AUTH.SWITCH_TO_SIGNUP);
            }}
            type="button"
          >
            <UserPlusIcon className="size-4" />
            <div>Create a testnet account</div>
          </button>
        )}
        <button
          className="flex items-center space-x-1 text-sm underline"
          onClick={() => {
            disconnect?.();
            Leafwatch.track(AUTH.LOGOUT_WALLET);
          }}
          type="reset"
        >
          <KeyIcon className="size-4" />
          <div>Logout from wallet</div>
        </button>
      </div>
      {errorChallenge || errorAuthenticate ? (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="size-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
