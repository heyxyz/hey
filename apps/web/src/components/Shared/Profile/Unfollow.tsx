import { UserMinusIcon } from '@heroicons/react/24/outline';
import { LensHub } from '@lenster/abis';
import { LENSHUB_PROXY } from '@lenster/data/constants';
import { PROFILE } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation,
  useUnfollowMutation
} from '@lenster/lens';
import type { ApolloCache } from '@lenster/lens/apollo';
import getSignature from '@lenster/lib/getSignature';
import { Button, Spinner } from '@lenster/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useNonceStore } from 'src/store/nonce';
import { useContractWrite, useSignTypedData } from 'wagmi';

interface UnfollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;
}

const Unfollow: FC<UnfollowProps> = ({
  profile,
  showText = false,
  setFollowing
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: { isFollowedByMe: () => false }
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
    toast.success(t`Unfollowed successfully!`);
    Leafwatch.track(PROFILE.UNFOLLOW, {
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
    functionName: 'unfollow',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { id, typedData } = createUnfollowTypedData;
      // TODO: Replace deep clone with right helper
      const signature = await signTypedDataAsync(
        getSignature(JSON.parse(JSON.stringify(typedData)))
      );
      setUserSigNonce(userSigNonce + 1);
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === 'RelayError') {
        const { unfollowerProfileId, idsOfProfilesToUnfollow } =
          typedData.value;
        return write?.({
          args: [unfollowerProfileId, idsOfProfilesToUnfollow]
        });
      }
    },
    onError,
    update: updateCache
  });

  const [unfollow] = useUnfollowMutation({
    onCompleted: ({ unfollow }) => onCompleted(unfollow.__typename),
    onError,
    update: updateCache
  });

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
      const { data } = await unfollow({
        variables: { request: { unfollow: [{ profileId: profile?.id }] } }
      });

      if (!data?.unfollow) {
        return await createUnfollowTypedData({
          variables: {
            request: { unfollow: [{ profileId: profile?.id }] },
            options: { overrideSigNonce: userSigNonce }
          }
        });
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline
      onClick={createUnfollow}
      disabled={isLoading}
      variant="danger"
      aria-label="Unfollow"
      icon={
        isLoading ? (
          <Spinner variant="danger" size="xs" />
        ) : (
          <UserMinusIcon className="h-4 w-4" />
        )
      }
    >
      {showText ? t`Following` : null}
    </Button>
  );
};

export default Unfollow;
