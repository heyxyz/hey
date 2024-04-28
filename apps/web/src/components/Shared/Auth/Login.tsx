import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfilesManagedRequest
} from '@hey/lens';
import type { FC } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import errorToast from '@helpers/errorToast';
import { Leafwatch } from '@helpers/leafwatch';
import { KeyIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Errors } from '@hey/data/errors';
import { AUTH } from '@hey/data/tracking';
import {
  ManagedProfileVisibility,
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@hey/lens';
import { Button, Card } from '@hey/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import { signIn } from 'src/store/persisted/useAuthStore';
import { useAccount, useChainId, useDisconnect, useSignMessage } from 'wagmi';

import Loader from '../Loader';
import UserProfile from '../UserProfile';
import SignupCard from './SignupCard';
import WalletSelector from './WalletSelector';

interface LoginProps {
  setHasProfiles: (hasProfiles: boolean) => void;
}

const Login: FC<LoginProps> = ({ setHasProfiles }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const chain = useChainId();
  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ mutation: { onError } });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();

  const lastLoggedInProfileRequest: LastLoggedInProfileRequest = {
    for: address
  };

  const profilesManagedRequest: ProfilesManagedRequest = {
    for: address,
    hiddenFilter: ManagedProfileVisibility.NoneHidden
  };

  const { data: profilesManaged, loading: profilesManagedLoading } =
    useProfilesManagedQuery({
      onCompleted: (data) => {
        setHasProfiles(data?.profilesManaged.items.length > 0);
      },
      skip: !address,
      variables: { lastLoggedInProfileRequest, profilesManagedRequest }
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
      Leafwatch.track(AUTH.LOGIN, { profile_id: id, source: 'login' });
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

  return activeConnector?.id ? (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {chain === CHAIN.id ? (
          profilesManagedLoading ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              <Loader
                className="my-4"
                message="Loading profiles managed by you..."
                small
              />
            </Card>
          ) : profiles.length > 0 ? (
            <Card
              className="max-h-[50vh] w-full overflow-y-auto dark:divide-gray-700"
              forceRounded
            >
              {profiles.map((profile) => (
                <div
                  className="flex items-center justify-between p-3"
                  key={profile.id}
                >
                  <UserProfile
                    hideFollowButton
                    hideUnfollowButton
                    linkToProfile={false}
                    profile={profile as Profile}
                    showUserPreview={false}
                  />
                  <Button
                    disabled={isLoading && loggingInProfileId === profile.id}
                    onClick={() => handleSign(profile.id)}
                    outline
                  >
                    Login
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <SignupCard />
          )
        ) : (
          <SwitchNetwork toChainId={CHAIN.id} />
        )}
        <button
          className="flex items-center space-x-1 text-sm underline"
          onClick={() => {
            disconnect?.();
            Leafwatch.track(AUTH.CHANGE_WALLET);
          }}
          type="reset"
        >
          <KeyIcon className="size-4" />
          <div>Change wallet</div>
        </button>
      </div>
      {errorChallenge || errorAuthenticate ? (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="size-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      ) : null}
    </div>
  ) : (
    <WalletSelector />
  );
};

export default Login;
