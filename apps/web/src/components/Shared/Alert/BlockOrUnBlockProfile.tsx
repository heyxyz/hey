import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { PROFILE } from '@hey/data/tracking';
import type { BlockRequest, UnblockRequest } from '@hey/lens';
import {
  useBlockMutation,
  useBroadcastOnchainMutation,
  useCreateBlockProfilesTypedDataMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import getProfile from '@hey/lib/getProfile';
import getSignature from '@hey/lib/getSignature';
import { Alert } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/useAppStore';
import { useGlobalAlertStateStore } from 'src/store/useGlobalAlertStateStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

const BlockOrUnBlockProfile: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    showBlockOrUnblockAlert,
    setShowBlockOrUnblockAlert,
    blockingorUnblockingProfile
  } = useGlobalAlertStateStore();
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingProfile?.operations.isBlockedByMe.value
  );

  const handleWrongNetwork = useHandleWrongNetwork();

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `ProfileOperations:${blockingorUnblockingProfile?.id}`,
      fields: {
        isBlockedByMe: (existingValue) => {
          return { ...existingValue, value: !hasBlocked };
        }
      }
    });
  };

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setIsLoading(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false, null);
    toast.success(
      hasBlocked ? 'Blocked successfully!' : 'Unblocked successfully!'
    );
    Leafwatch.track(hasBlocked ? PROFILE.BLOCK : PROFILE.UNBLOCK, {
      profile_id: blockingorUnblockingProfile?.id
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'setBlockStatus',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });

  const [createBlockProfilesTypedData] =
    useCreateBlockProfilesTypedDataMutation({
      onCompleted: async ({ createBlockProfilesTypedData }) => {
        const { id, typedData } = createBlockProfilesTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] });
        }
      },
      onError,
      update: updateCache
    });

  const [createUnblockProfilesTypedData] =
    useCreateUnblockProfilesTypedDataMutation({
      onCompleted: async ({ createUnblockProfilesTypedData }) => {
        const { id, typedData } = createUnblockProfilesTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] });
        }
      },
      onError,
      update: updateCache
    });

  const [blockProfile] = useBlockMutation({
    onCompleted: ({ block }) => onCompleted(block.__typename),
    onError,
    update: updateCache
  });

  const [unBlockProfile] = useUnblockMutation({
    onCompleted: ({ unblock }) => onCompleted(unblock.__typename),
    onError,
    update: updateCache
  });

  const blockOrUnblock = async () => {
    if (!currentProfile) {
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const request: BlockRequest | UnblockRequest = {
        profiles: [blockingorUnblockingProfile?.id]
      };

      if (hasBlocked) {
        const { data } = await unBlockProfile({ variables: { request } });
        if (data?.unblock.__typename === 'LensProfileManagerRelayError') {
          return await createUnblockProfilesTypedData({
            variables: {
              options: { overrideSigNonce: lensHubOnchainSigNonce },
              request
            }
          });
        }
      }

      const { data } = await blockProfile({ variables: { request } });
      if (data?.block.__typename === 'LensProfileManagerRelayError') {
        return await createBlockProfilesTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request
          }
        });
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Alert
      title="Block Profile"
      description={`Are you sure you want to ${
        hasBlocked ? 'un-block' : 'block'
      } ${getProfile(blockingorUnblockingProfile).slugWithPrefix}?`}
      confirmText={hasBlocked ? 'Unblock' : 'Block'}
      show={showBlockOrUnblockAlert}
      isDestructive
      isPerformingAction={isLoading}
      onConfirm={blockOrUnblock}
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
    />
  );
};

export default BlockOrUnBlockProfile;
