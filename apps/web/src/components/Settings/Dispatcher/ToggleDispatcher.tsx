import IndexStatus from '@components/Shared/IndexStatus';
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import { LensHub } from '@lenster/abis';
import {
  LENSHUB_PROXY,
  OLD_LENS_RELAYER_ADDRESS
} from '@lenster/data/constants';
import {
  useBroadcastMutation,
  useCreateSetDispatcherTypedDataMutation
} from '@lenster/lens';
import getIsDispatcherEnabled from '@lenster/lib/getIsDispatcherEnabled';
import getSignature from '@lenster/lib/getSignature';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { SETTINGS } from 'src/tracking';
import { Button, Spinner } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface ToggleDispatcherProps {
  buttonSize?: 'sm';
}

const ToggleDispatcher: FC<ToggleDispatcherProps> = ({ buttonSize = 'md' }) => {
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const canUseRelay = getIsDispatcherEnabled(currentProfile);
  const isOldDispatcherEnabled =
    currentProfile?.dispatcher?.address?.toLocaleLowerCase() ===
    OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase();

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success(t`Profile updated successfully!`);
    if (isOldDispatcherEnabled) {
      Leafwatch.track(SETTINGS.DISPATCHER.UPDATE);
    } else {
      Leafwatch.track(SETTINGS.DISPATCHER.TOGGLE);
    }
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { data: writeData, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setDispatcher',
    onSuccess: () => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const [broadcast, { data: broadcastData }] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });
  const [createSetDispatcherTypedData] =
    useCreateSetDispatcherTypedDataMutation({
      onCompleted: async ({ createSetDispatcherTypedData }) => {
        const { id, typedData } = createSetDispatcherTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast.__typename === 'RelayError') {
          const { profileId, dispatcher } = typedData.value;
          return write?.({
            args: [profileId, dispatcher]
          });
        }
      },
      onError
    });

  const toggleDispatcher = async () => {
    try {
      setIsLoading(true);
      return await createSetDispatcherTypedData({
        variables: {
          request: {
            profileId: currentProfile?.id,
            enable: canUseRelay ? false : true
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const getButtonText = () => {
    if (canUseRelay) {
      return <Trans>Disable</Trans>;
    } else if (isOldDispatcherEnabled) {
      return <Trans>Update</Trans>;
    } else {
      return <Trans>Enable</Trans>;
    }
  };

  const broadcastTxHash =
    broadcastData?.broadcast.__typename === 'RelayerResult' &&
    broadcastData.broadcast.txHash;

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
