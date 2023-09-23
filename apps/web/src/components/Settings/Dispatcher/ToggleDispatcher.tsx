import IndexStatus from '@components/Shared/IndexStatus';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@lenster/abis';
import { LENSHUB_PROXY } from '@lenster/data/constants';
import { SETTINGS } from '@lenster/data/tracking';
import {
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@lenster/lens';
import getSignature from '@lenster/lib/getSignature';
import { Button, Spinner } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface ToggleDispatcherProps {
  buttonSize?: 'sm';
}

const ToggleDispatcher: FC<ToggleDispatcherProps> = ({ buttonSize = 'md' }) => {
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const canUseRelay = currentProfile?.lensManager;

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success(t`Profile updated successfully!`);
    Leafwatch.track(SETTINGS.DISPATCHER.TOGGLE);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { data: writeData, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'changeDelegatedExecutorsConfig',
    onSuccess: () => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const [broadcastOnchain, { data: broadcastData }] =
    useBroadcastOnchainMutation({
      onCompleted: ({ broadcastOnchain }) =>
        onCompleted(broadcastOnchain.__typename)
    });
  const [createChangeProfileManagersTypedData] =
    useCreateChangeProfileManagersTypedDataMutation({
      onCompleted: async ({ createChangeProfileManagersTypedData }) => {
        const { id, typedData } = createChangeProfileManagersTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          const {
            delegatorProfileId,
            delegatedExecutors,
            approvals,
            configNumber,
            switchToGivenConfig
          } = typedData.value;
          return write?.({
            args: [
              delegatorProfileId,
              delegatedExecutors,
              approvals,
              configNumber,
              switchToGivenConfig
            ]
          });
        }
      },
      onError
    });

  const toggleDispatcher = async () => {
    try {
      setIsLoading(true);
      return await createChangeProfileManagersTypedData({
        variables: {
          request: { approveLensManager: canUseRelay ? false : true }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const getButtonText = () => {
    if (canUseRelay) {
      return <Trans>Disable</Trans>;
    }

    return <Trans>Enable</Trans>;
  };

  const broadcastTxHash =
    broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' &&
    broadcastData.broadcastOnchain.txHash;

  return writeData?.hash ?? broadcastTxHash ? (
    <div className="mt-2">
      <IndexStatus txHash={writeData?.hash ?? broadcastTxHash} reload />
    </div>
  ) : (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      className={cn({ 'text-sm': buttonSize === 'sm' }, 'mr-auto')}
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner variant={canUseRelay ? 'danger' : 'primary'} size="xs" />
        ) : canUseRelay ? (
          <XMarkIcon className="h-4 w-4" />
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
