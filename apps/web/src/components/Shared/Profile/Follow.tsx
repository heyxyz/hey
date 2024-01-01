import type { FollowRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import { UserPlusIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { PROFILE } from '@hey/data/tracking';
import {
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useFollowMutation
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
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

interface FollowProps {
  profile: Profile;
  showText?: boolean;
}

const Follow: FC<FollowProps> = ({ profile, showText = false }) => {
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
  const { cache } = useApolloClient();

  const { canBroadcast, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const updateCache = () => {
    cache.modify({
      fields: {
        isFollowedByMe: (existingValue) => {
          return { ...existingValue, value: true };
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

    updateCache();
    setIsLoading(false);
    toast.success('Followed successfully!');
    Leafwatch.track(PROFILE.FOLLOW, { path: pathname, target: profile?.id });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: 'follow',
    onError,
    onSuccess: () => onCompleted()
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { id, typedData } = createFollowTypedData;
      const {
        datas,
        followerProfileId,
        followTokenIds,
        idsOfProfilesToFollow
      } = typedData.value;
      const args = [
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
      ];

      if (canBroadcast) {
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write({ args });
        }
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

        return;
      }

      return write({ args });
    },
    onError
  });

  const [follow] = useFollowMutation({
    onCompleted: ({ follow }) => onCompleted(follow.__typename),
    onError
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
      aria-label="Follow"
      className="!px-3 !py-1.5 text-sm"
      disabled={isLoading}
      icon={
        isLoading ? <Spinner size="xs" /> : <UserPlusIcon className="size-4" />
      }
      onClick={createFollow}
      outline
    >
      {showText ? 'Follow' : null}
    </Button>
  );
};

export default Follow;
