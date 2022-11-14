import { LensHubProxy } from '@abis/LensHubProxy';
import IndexStatus from '@components/Shared/IndexStatus';
import UserProfile from '@components/Shared/UserProfile';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { Profile } from '@generated/types';
import { useCreateSetDefaultProfileTypedDataMutation } from '@generated/types';
import { ExclamationIcon, PencilIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

const SetProfile: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const [selectedUser, setSelectedUser] = useState('');
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    toast.success('Default profile updated successfully!');
    Leafwatch.track(SETTINGS.ACCOUNT.SET_DEFAULT_PROFILE);
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'setDefaultProfileWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const hasDefaultProfile = !!profiles.find((o) => o.isDefault);
  const sortedProfiles: Profile[] = profiles?.sort((a, b) =>
    a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
  );

  useEffect(() => {
    setSelectedUser(sortedProfiles[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetDefaultProfileTypedData, { loading: typedDataLoading }] =
    useCreateSetDefaultProfileTypedDataMutation({
      onCompleted: async ({ createSetDefaultProfileTypedData }) => {
        try {
          const { id, typedData } = createSetDefaultProfileTypedData;
          const { wallet, profileId, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            follower: address,
            wallet,
            profileId,
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }
        } catch {}
      },
      onError
    });

  const setDefaultProfile = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    const request = { profileId: selectedUser };
    createSetDefaultProfileTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request
      }
    });
  };

  if (!currentProfile) {
    return <Custom404 />;
  }

  const isLoading = typedDataLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <Card className="space-y-5 p-5">
      {error && <ErrorMessage title="Transaction failed!" error={error} />}
      {hasDefaultProfile ? (
        <>
          <div className="text-lg font-bold">Your default profile</div>
          <UserProfile profile={sortedProfiles[0]} />
        </>
      ) : (
        <div className="flex items-center space-x-1.5 font-bold text-yellow-500">
          <ExclamationIcon className="w-5 h-5" />
          <div>You don&rsquo;t have any default profile set!</div>
        </div>
      )}
      <div className="text-lg font-bold">Select default profile</div>
      <p>
        Selecting your default account helps to display the selected profile across {APP_NAME}, you can change
        your default profile anytime.
      </p>
      <div className="text-lg font-bold">What else you should know</div>
      <div className="text-sm text-gray-500 divide-y dark:divide-gray-700">
        <p className="pb-3">
          Only the default profile will be visible across the {APP_NAME}, example notifications, follow etc.
        </p>
        <p className="py-3">You can change default profile anytime here.</p>
      </div>
      <div>
        <div className="label">Select profile</div>
        <select
          className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {sortedProfiles?.map((profile: Profile) => (
            <option key={profile?.id} value={profile?.id}>
              @{profile?.handle}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          className="ml-auto"
          type="submit"
          disabled={isLoading}
          onClick={setDefaultProfile}
          icon={isLoading ? <Spinner size="xs" /> : <PencilIcon className="w-4 h-4" />}
        >
          Save
        </Button>
        {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
          <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} reload />
        ) : null}
      </div>
    </Card>
  );
};

export default SetProfile;
