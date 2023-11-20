import { UserPlusIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { PROFILE } from '@hey/data/tracking';
import type { FollowRequest, Profile } from '@hey/lens';
import {
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useFollowMutation
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/useNonceStore';
import useProfilePersistStore from 'src/store/useProfilePersistStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface FollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;

  // For data analytics
  followPosition?: number;
  followSource?: string;
}

const Follow: FC<FollowProps> = ({
  profile,
  showText = false,
  setFollowing,
  followPosition,
  followSource
}) => {
  const pathname = usePathname();
  const currentProfile = useProfilePersistStore(
    (state) => state.currentProfile
  );

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

  const { canUseLensManager, canBroadcast } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: cache.identify(profile.operations),
      fields: {
        isFollowedByMe: (existingValue) => {
          return { ...existingValue, value: true };
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
    setFollowing(true);
    toast.success('Followed successfully!');
    Leafwatch.track(PROFILE.FOLLOW, {
      path: pathname,
      ...(followPosition && { position: followPosition }),
      ...(followSource && { source: followSource }),
      target: profile?.id
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
    functionName: 'follow',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { id, typedData } = createFollowTypedData;
      const signature = await signTypedDataAsync(getSignature(typedData));
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      const {
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
      } = typedData.value;
      const args = [
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
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
    onError,
    update: updateCache
  });

  const [follow] = useFollowMutation({
    onCompleted: ({ follow }) => onCompleted(follow.__typename),
    onError,
    update: updateCache
  });

  const followViaLensManager = async (request: FollowRequest) => {
    const { data } = await follow({ variables: { request } });
    if (data?.follow?.__typename === 'LensProfileManagerRelayError') {
      await createFollowTypedData({ variables: { request } });
    }
    return;
  };

  const createFollow = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      const request: FollowRequest = { follow: [{ profileId: profile?.id }] };

      if (canUseLensManager) {
        return await followViaLensManager(request);
      }

      return await createFollowTypedData({
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
      className="!px-3 !py-1.5 text-sm"
      onClick={createFollow}
      aria-label="Follow"
      disabled={isLoading}
      icon={
        isLoading ? <Spinner size="xs" /> : <UserPlusIcon className="h-4 w-4" />
      }
      outline
    >
      {showText ? 'Follow' : null}
    </Button>
  );
};

export default Follow;
