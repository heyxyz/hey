import type { Profile, UnfollowRequest } from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import type { FC } from 'react';

import { UserMinusIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { PROFILE } from '@hey/data/tracking';
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation,
  useUnfollowMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface UnfollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;

  // For data analytics
  unfollowPosition?: number;
  unfollowSource?: string;
}

const Unfollow: FC<UnfollowProps> = ({
  profile,
  setFollowing,
  showText = false,
  unfollowPosition,
  unfollowSource
}) => {
  const { pathname } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      fields: {
        isFollowedByMe: (existingValue) => {
          return { ...existingValue, value: false };
        }
      },
      id: cache.identify(profile.operations)
    });
  };

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setIsLoading(false);
    setFollowing(false);
    toast.success('Unfollowed successfully!');
    Leafwatch.track(PROFILE.UNFOLLOW, {
      path: pathname,
      ...(unfollowPosition && { position: unfollowPosition }),
      ...(unfollowSource && { source: unfollowSource }),
      target: profile?.id
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'unfollow',
    onError,
    onSuccess: () => onCompleted()
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { id, typedData } = createUnfollowTypedData;
      const signature = await signTypedDataAsync(getSignature(typedData));
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      const { idsOfProfilesToUnfollow, unfollowerProfileId } = typedData.value;
      const args = [unfollowerProfileId, idsOfProfilesToUnfollow];

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
    onError,
    update: updateCache
  });

  const [unfollow] = useUnfollowMutation({
    onCompleted: ({ unfollow }) => onCompleted(unfollow.__typename),
    onError,
    update: updateCache
  });

  const unfollowViaLensManager = async (request: UnfollowRequest) => {
    const { data } = await unfollow({ variables: { request } });
    if (data?.unfollow?.__typename === 'LensProfileManagerRelayError') {
      return await createUnfollowTypedData({ variables: { request } });
    }
  };

  const createUnfollow = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const request: UnfollowRequest = { unfollow: [profile?.id] };

      if (canUseLensManager) {
        return await unfollowViaLensManager(request);
      }

      return await createUnfollowTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      aria-label="Unfollow"
      className="!px-3 !py-1.5 text-sm"
      disabled={isLoading}
      icon={
        isLoading ? (
          <Spinner size="xs" variant="danger" />
        ) : (
          <UserMinusIcon className="h-4 w-4" />
        )
      }
      onClick={createUnfollow}
      outline
      variant="danger"
    >
      {showText ? 'Following' : null}
    </Button>
  );
};

export default Unfollow;
