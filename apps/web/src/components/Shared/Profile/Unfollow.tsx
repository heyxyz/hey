import { UserMinusIcon } from '@heroicons/react/24/outline';
import { FollowNft } from '@hey/abis';
import { Errors } from '@hey/data/errors';
import { PROFILE } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import {
  useBroadcastMutation,
  useCreateUnfollowTypedDataMutation
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';
import getSignature from '@hey/lib/getSignature';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/app';
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
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const updateCache = (cache: ApolloCache<any>) => {
    cache.modify({
      id: `Profile:${profile?.id}`,
      fields: { isFollowedByMe: () => false }
    });
  };

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    setFollowing(false);
    toast.success(t`Unfollowed successfully!`);
    Leafwatch.track(PROFILE.UNFOLLOW);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: profile.followNftAddress,
    abi: FollowNft,
    functionName: 'burn',
    onSuccess: () => onCompleted(),
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });

  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { typedData, id } = createUnfollowTypedData;
      const signature = await signTypedDataAsync(getSignature(typedData));
      const { data } = await broadcast({
        variables: { request: { id, signature } }
      });
      if (data?.broadcast.__typename === 'RelayError') {
        const { tokenId } = typedData.value;
        return write?.({ args: [tokenId] });
      }
    },
    onError,
    update: updateCache
  });

  const createUnfollow = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createUnfollowTypedData({
        variables: { request: { profile: profile?.id } }
      });
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
