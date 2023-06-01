import UserProfile from '@components/Shared/UserProfile';
import { ExclamationIcon, PencilIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import { APP_NAME, LENSHUB_PROXY } from '@lenster/data/constants';
import Errors from '@lenster/data/errors';
import type { CreateSetDefaultProfileRequest, Profile } from '@lenster/lens';
import {
  useBroadcastMutation,
  useCreateSetDefaultProfileTypedDataMutation
} from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getSignature from '@lenster/lib/getSignature';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { SETTINGS } from 'src/tracking';
import { Button, Card, ErrorMessage, Spinner } from 'ui';
import { useEffectOnce } from 'usehooks-ts';
import { useContractWrite, useSignTypedData } from 'wagmi';

const SetProfile: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success(t`Default profile updated successfully!`);
    Leafwatch.track(SETTINGS.ACCOUNT.SET_DEFAULT_PROFILE);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setDefaultProfile',
    onSuccess: () => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const hasDefaultProfile = Boolean(profiles.find((o) => o.isDefault));
  const sortedProfiles: Profile[] = profiles?.sort((a, b) =>
    a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
  );

  useEffectOnce(() => {
    setSelectedUser(sortedProfiles[0]?.id);
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const [createSetDefaultProfileTypedData] =
    useCreateSetDefaultProfileTypedDataMutation({
      onCompleted: async ({ createSetDefaultProfileTypedData }) => {
        const { id, typedData } = createSetDefaultProfileTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast.__typename === 'RelayError') {
          const { profileId } = typedData.value;
          return write?.({ args: [profileId] });
        }
      },
      onError
    });

  const setDefaultProfile = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);
      const request: CreateSetDefaultProfileRequest = {
        profileId: selectedUser
      };
      return await createSetDefaultProfileTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <Card className="space-y-5 p-5">
      {error && <ErrorMessage title={t`Transaction failed!`} error={error} />}
      {hasDefaultProfile ? (
        <>
          <div className="text-lg font-bold">
            <Trans>Your default profile</Trans>
          </div>
          <UserProfile profile={sortedProfiles[0]} />
        </>
      ) : (
        <div className="flex items-center space-x-1.5 font-bold text-yellow-500">
          <ExclamationIcon className="h-5 w-5" />
          <div>
            <Trans>You don't have any default profile set!</Trans>
          </div>
        </div>
      )}
      <div className="text-lg font-bold">
        <Trans>Select default profile</Trans>
      </div>
      <p>
        <Trans>
          Selecting your default account helps to display the selected profile
          across {APP_NAME}, you can change your default profile anytime.
        </Trans>
      </p>
      <div className="text-lg font-bold">
        <Trans>What else you should know</Trans>
      </div>
      <div className="lt-text-gray-500 divide-y text-sm dark:divide-gray-700">
        <p className="pb-3">
          <Trans>
            Only the default profile will be visible across the {APP_NAME},
            example notifications, follow etc.
          </Trans>
        </p>
        <p className="py-3">
          <Trans>You can change default profile anytime here.</Trans>
        </p>
      </div>
      <div>
        <div className="label">
          <Trans>Select profile</Trans>
        </div>
        <select
          className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {sortedProfiles?.map((profile: Profile) => (
            <option key={profile?.id} value={profile?.id}>
              @{formatHandle(profile?.handle)}
            </option>
          ))}
        </select>
      </div>
      <Button
        className="ml-auto"
        type="submit"
        disabled={isLoading}
        onClick={setDefaultProfile}
        icon={
          isLoading ? <Spinner size="xs" /> : <PencilIcon className="h-4 w-4" />
        }
      >
        <Trans>Save</Trans>
      </Button>
    </Card>
  );
};

export default SetProfile;
