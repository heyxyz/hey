import { UserPlusIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { IS_MAINNET } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PROFILE } from '@hey/data/tracking';
import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@hey/lens';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { ErrorMessage, Image, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';

import errorToast from '@/lib/errorToast';
import { Leafwatch } from '@/lib/leafwatch';
import { useGlobalModalStateStore } from '@/store/non-persisted/useGlobalModalStateStore';
import { signIn, signOut } from '@/store/persisted/useAuthStore';
import useProfileStore from '@/store/persisted/useProfileStore';

import Loader from './Loader';

const SwitchProfiles: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setShowProfileSwitchModal = useGlobalModalStateStore(
    (state) => state.setShowProfileSwitchModal
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<string | null>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });

  const request: ProfileManagersRequest | LastLoggedInProfileRequest = {
    for: address
  };
  const { data, loading, error } = useProfilesManagedQuery({
    variables: {
      profilesManagedRequest: request,
      lastLoggedInProfileRequest: request
    }
  });
  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate] = useAuthenticateMutation();

  if (loading) {
    return <Loader message="Loading Profiles" />;
  }

  const profiles = data?.profilesManaged.items || [];

  const switchProfile = async (id: string) => {
    try {
      setLoggingInProfileId(id);
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
      signOut();
      signIn({ accessToken, refreshToken });
      Leafwatch.track(PROFILE.SWITCH_PROFILE, { switch_profile_to: id });
      location.reload();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <ErrorMessage
        title="Failed to load profiles"
        error={error}
        className="m-2"
      />
      {profiles.map((profile, index) => (
        <button
          key={profile?.id}
          type="button"
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={async () => {
            const selectedProfile = profiles[index] as Profile;
            await switchProfile(selectedProfile.id);
          }}
        >
          <span className="flex items-center space-x-2">
            <Image
              className="h-6 w-6 rounded-full border dark:border-gray-700"
              height={20}
              width={20}
              src={getAvatar(profile)}
              alt={profile.id}
            />
            <div
              className={cn(
                currentProfile?.id === profile?.id && 'font-bold',
                'truncate'
              )}
            >
              {getProfile(profile as Profile).slugWithPrefix}
            </div>
          </span>
          {isLoading && profile.id === loggingInProfileId ? (
            <Spinner size="xs" />
          ) : currentProfile?.id === profile?.id ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : null}
        </button>
      ))}
      {!IS_MAINNET ? (
        <Link
          to="/new/profile"
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => setShowProfileSwitchModal(false)}
        >
          <span className="flex items-center space-x-2">
            <div className="dark:border-brand-700 border-brand-400 bg-brand-500/20 flex h-6 w-6 items-center justify-center rounded-full border">
              <UserPlusIcon className="text-brand-500 h-3 w-3" />
            </div>
            <div>Create Profile</div>
          </span>
        </Link>
      ) : null}
    </div>
  );
};

export default SwitchProfiles;
