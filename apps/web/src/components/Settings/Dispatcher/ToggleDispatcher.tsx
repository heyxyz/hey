import IndexStatus from '@components/Shared/IndexStatus';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { LensHubProxy } from 'abis';
import clsx from 'clsx';
import { useCreateSetDispatcherTypedDataMutation } from 'lens';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { LENSHUB_PROXY, RELAY_ON } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  buttonSize?: 'sm';
}

const ToggleDispatcher: FC<Props> = ({ buttonSize = 'md' }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;

  const onCompleted = () => {
    toast.success('Profile updated successfully!');
    Leafwatch.track(SETTINGS.DISPATCHER.TOGGLE);
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useCreateSetDispatcherTypedDataMutation({
      onCompleted: async ({ createSetDispatcherTypedData }) => {
        try {
          const { id, typedData } = createSetDispatcherTypedData;
          const { profileId, dispatcher, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            dispatcher,
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

  const isLoading = signLoading || writeLoading || broadcastLoading || typedDataLoading;

  return writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
    <div className="mt-2">
      <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} reload />
    </div>
  ) : (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      className={clsx({ 'text-sm': buttonSize === 'sm' }, `mr-auto`)}
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner variant={canUseRelay ? 'danger' : 'primary'} size="xs" />
        ) : canUseRelay ? (
          <XIcon className="w-4 h-4" />
        ) : (
          <CheckCircleIcon className="w-4 h-4" />
        )
      }
      onClick={() => {
        createSetProfileMetadataTypedData({
          variables: {
            request: {
              profileId: currentProfile?.id,
              enable: canUseRelay ? false : true
            }
          }
        });
      }}
    >
      {canUseRelay ? 'Disable' : 'Enable'} dispatcher
    </Button>
  );
};

export default ToggleDispatcher;
