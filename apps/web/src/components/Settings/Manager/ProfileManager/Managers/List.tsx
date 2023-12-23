import type { ProfileManagersRequest } from '@hey/lens';
import type { FC } from 'react';
import type { Address } from 'viem';

import Loader from '@components/Shared/Loader';
import WalletProfile from '@components/Shared/WalletProfile';
import { MinusCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
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
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, EmptyState, ErrorMessage, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

const List: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const [removingAddress, setRemovingAddress] = useState<Address | null>(null);

  const handleWrongNetwork = useHandleWrongNetwork();
  const { cache } = useApolloClient();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
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

  const request: ProfileManagersRequest = { for: currentProfile?.id };
  const { data, error, fetchMore, loading } = useProfileManagersQuery({
    variables: { request }
  });

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'changeDelegatedExecutorsConfig',
    onError,
    onSuccess: () => onCompleted()
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
        const {
          approvals,
          configNumber,
          delegatedExecutors,
          delegatorProfileId,
          switchToGivenConfig
        } = typedData.value;
        const args = [
          delegatorProfileId,
          delegatedExecutors,
          approvals,
          configNumber,
          switchToGivenConfig
        ];

        if (canBroadcast) {
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return write({ args });
          }
          return;
        }

        return write({ args });
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
              { action: ChangeProfileManagerActionType.Remove, address }
            ]
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const profileManagers = data?.profileManagers.items.filter(
    (item) => !item.isLensManager
  );
  const pageInfo = data?.profileManagers?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      return await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return (
      <div className="pb-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load profile managers" />
    );
  }

  if (profileManagers?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UserCircleIcon className="text-brand-500 size-8" />}
        message="No profile managers added!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {profileManagers?.map((manager) => (
        <div
          className="flex items-center justify-between"
          key={manager.address}
        >
          <WalletProfile address={manager.address} />
          <Button
            disabled={removingAddress === manager.address}
            icon={
              removingAddress === manager.address ? (
                <Spinner size="xs" />
              ) : (
                <MinusCircleIcon className="size-4" />
              )
            }
            onClick={() => removeManager(manager.address)}
            outline
          >
            Remove
          </Button>
        </div>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default List;
