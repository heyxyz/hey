import Loader from '@components/Shared/Loader';
import WalletProfile from '@components/Shared/WalletProfile';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { SETTINGS } from '@hey/data/tracking';
import {
  ChangeProfileManagerActionType,
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation,
  useProfileManagersQuery
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import getSignature from '@hey/lib/getSignature';
import { Button, ErrorMessage, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/useAppStore';
import { useNonceStore } from 'src/store/useNonceStore';
import type { Address } from 'viem';
import { useContractWrite, useSignTypedData } from 'wagmi';

const Managers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const [removingAddress, setRemovingAddress] = useState<Address | null>(null);

  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    cache.evict({ id: `ProfilesManagedResult:${removingAddress}` });
    toast.success('Manager removed successfully!');
    Leafwatch.track(SETTINGS.MANAGER.REMOVE_MANAGER);
  };

  const onError = (error: any) => {
    errorToast(error);
    setRemovingAddress(null);
  };

  const { data, loading, error } = useProfileManagersQuery({
    variables: { request: { for: currentProfile?.id } }
  });

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'changeDelegatedExecutorsConfig',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createChangeProfileManagersTypedData] =
    useCreateChangeProfileManagersTypedDataMutation({
      onCompleted: async ({ createChangeProfileManagersTypedData }) => {
        const { id, typedData } = createChangeProfileManagersTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
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

  const removeManager = async (address: Address) => {
    if (handleWrongNetwork()) {
      return;
    }

    try {
      setRemovingAddress(address);
      return await createChangeProfileManagersTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: {
            changeManagers: [
              { address, action: ChangeProfileManagerActionType.Remove }
            ]
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div>
        <div>
          Accounts with control over your profile can act on your behalf.
        </div>
        <div className="divider my-5" />
        <div className="space-y-5">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            data?.profileManagers.items.map((manager) => (
              <div
                key={manager.address}
                className="flex items-center justify-between"
              >
                <WalletProfile address={manager.address} />
                <Button
                  icon={
                    removingAddress === manager.address ? (
                      <Spinner size="xs" />
                    ) : (
                      <MinusCircleIcon className="h-4 w-4" />
                    )
                  }
                  onClick={() => removeManager(manager.address)}
                  disabled={removingAddress === manager.address}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Managers;
