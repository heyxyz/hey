import IndexStatus from '@components/Shared/IndexStatus';
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { t, Trans } from '@lingui/macro';
import { LensHub } from 'abis';
import clsx from 'clsx';
import { LENSHUB_PROXY, OLD_LENS_RELAYER_ADDRESS } from 'data/constants';
import { useBroadcastMutation, useCreateSetDispatcherTypedDataMutation } from 'lens';
import getIsDispatcherEnabled from 'lib/getIsDispatcherEnabled';
import getSignature from 'lib/getSignature';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { SETTINGS } from 'src/tracking';
import { Button, Spinner } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface ToggleDispatcherProps {
  buttonSize?: 'sm';
}

const ToggleDispatcher: FC<ToggleDispatcherProps> = ({ buttonSize = 'md' }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = getIsDispatcherEnabled(currentProfile);
  const isOldDispatcherEnabled =
    currentProfile?.dispatcher?.address?.toLocaleLowerCase() === OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase();

  const onCompleted = () => {
    toast.success(t`Profile updated successfully!`);
    if (isOldDispatcherEnabled) {
      Mixpanel.track(SETTINGS.DISPATCHER.UPDATE);
    } else {
      Mixpanel.track(SETTINGS.DISPATCHER.TOGGLE);
    }
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useBroadcastMutation({
    onCompleted
  });
  const [createSetDispatcherTypedData, { loading: typedDataLoading }] =
    useCreateSetDispatcherTypedDataMutation({
      onCompleted: async ({ createSetDispatcherTypedData }) => {
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
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      },
      onError
    });

  const toggleDispatcher = async () => {
    try {
      await createSetDispatcherTypedData({
        variables: {
          request: {
            profileId: currentProfile?.id,
            enable: canUseRelay ? false : true
          }
        }
      });
    } catch {}
  };

  const getButtonText = () => {
    if (canUseRelay) {
      return <Trans>Disable dispatcher</Trans>;
    } else if (isOldDispatcherEnabled) {
      return <Trans>Update dispatcher</Trans>;
    } else {
      return <Trans>Enable dispatcher</Trans>;
    }
  };

  const isLoading = signLoading || writeLoading || broadcastLoading || typedDataLoading;
  const broadcastTxHash =
    broadcastData?.broadcast.__typename === 'RelayerResult' && broadcastData.broadcast.txHash;

  return writeData?.hash ?? broadcastTxHash ? (
    <div className="mt-2">
      <IndexStatus txHash={writeData?.hash ?? broadcastTxHash} reload />
    </div>
  ) : (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      className={clsx({ 'text-sm': buttonSize === 'sm' }, 'mr-auto')}
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner variant={canUseRelay ? 'danger' : 'primary'} size="xs" />
        ) : canUseRelay ? (
          <XIcon className="h-4 w-4" />
        ) : (
          <CheckCircleIcon className="h-4 w-4" />
        )
      }
      onClick={toggleDispatcher}
    >
      {getButtonText()}
    </Button>
  );
};

export default ToggleDispatcher;
