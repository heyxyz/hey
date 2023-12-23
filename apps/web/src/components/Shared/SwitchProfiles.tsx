import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@hey/lens';
import type { FC } from 'react';

import { UserPlusIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { IS_MAINNET } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PROFILE } from '@hey/data/tracking';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { ErrorMessage, Image, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { signIn, signOut } from 'src/store/persisted/useAuthStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useAccount, useSignMessage } from 'wagmi';

import Loader from './Loader';

const SwitchProfiles: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setShowProfileSwitchModal = useGlobalModalStateStore(
    (state) => state.setShowProfileSwitchModal
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });

  const request: LastLoggedInProfileRequest | ProfileManagersRequest = {
    for: address
  };
  const { data, error, loading } = useProfilesManagedQuery({
    variables: {
      lastLoggedInProfileRequest: request,
      profilesManagedRequest: request
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
        className="m-2"
        error={error}
        title="Failed to load profiles"
      />
      {profiles.map((profile, index) => (
        <button
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          key={profile?.id}
          onClick={async () => {
            const selectedProfile = profiles[index] as Profile;
            await switchProfile(selectedProfile.id);
          }}
          type="button"
        >
          <span className="flex items-center space-x-2">
            <Image
              alt={profile.id}
              className="size-6 rounded-full border dark:border-gray-700"
              height={20}
              src={getAvatar(profile)}
              width={20}
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
            <CheckCircleIcon className="size-5 text-green-500" />
          ) : null}
        </button>
      ))}
      {!IS_MAINNET ? (
        <Link
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pl-3 pr-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          href="/new/profile"
          onClick={() => setShowProfileSwitchModal(false)}
        >
          <span className="flex items-center space-x-2">
            <div className="dark:border-brand-700 border-brand-400 bg-brand-500/20 flex size-6 items-center justify-center rounded-full border">
              <UserPlusIcon className="text-brand-500 size-3" />
            </div>
            <div>Create Profile</div>
          </span>
        </Link>
      ) : null}
    </div>
  );
};

export default SwitchProfiles;
