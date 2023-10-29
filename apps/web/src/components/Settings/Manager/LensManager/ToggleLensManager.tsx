import IndexStatus from '@components/Shared/IndexStatus';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import {
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@hey/lens';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface ToggleLensManagerProps {
  buttonSize?: 'sm';
}

const ToggleLensManager: FC<ToggleLensManagerProps> = ({
  buttonSize = 'md'
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const [isLoading, setIsLoading] = useState(false);
  const canUseRelay = currentProfile?.signless;

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    toast.success('Profile updated successfully!');
    Leafwatch.track(SETTINGS.MANAGER.TOGGLE);
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
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
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
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: { approveSignless: canUseRelay ? false : true }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const broadcastTxId =
    broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' &&
    broadcastData.broadcastOnchain.txId;

  return writeData?.hash || broadcastTxId ? (
    <div className="mt-2">
      <IndexStatus txHash={writeData?.hash} txId={broadcastTxId} reload />
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
      {canUseRelay ? 'Disable' : 'Enable'}
    </Button>
  );
};

export default ToggleLensManager;
