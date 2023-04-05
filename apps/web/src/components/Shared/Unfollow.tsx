import { UserRemoveIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { t } from '@lingui/macro';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { FollowNft } from 'abis';
import Errors from 'data/errors';
import type { CreateBurnEip712TypedData, Profile } from 'lens';
import { useBroadcastMutation, useCreateUnfollowTypedDataMutation } from 'lens';
import getSignature from 'lib/getSignature';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';
import { Button, Spinner } from 'ui';
import { useSignTypedData } from 'wagmi';

interface UnfollowProps {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
}

const Unfollow: FC<UnfollowProps> = ({ profile, showText = false, setFollowing }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [writeLoading, setWriteLoading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const burnWithSig = async (signature: string, typedData: CreateBurnEip712TypedData) => {
    const { tokenId, deadline } = typedData.value;
    const { v, r, s } = splitSignature(signature);
    const sig = { v, r, s, deadline };

    const config = await prepareWriteContract({
      address: typedData.domain.verifyingContract,
      abi: FollowNft,
      functionName: 'burnWithSig',
      args: [tokenId, sig]
    });

    const tx = await writeContract(config);
    if (tx) {
      setFollowing(false);
    }
  };

  const [broadcast] = useBroadcastMutation({
    onCompleted: () => {
      setFollowing(false);
    }
  });

  const [createUnfollowTypedData, { loading: typedDataLoading }] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { typedData, id } = createUnfollowTypedData;
      const signature = await signTypedDataAsync(getSignature(typedData));

      setWriteLoading(true);
      try {
        const { data } = await broadcast({ variables: { request: { id, signature } } });
        if (data?.broadcast.__typename === 'RelayError') {
          await burnWithSig(signature, typedData);
        }
        toast.success(t`Unfollowed successfully!`);
        Mixpanel.track(PROFILE.UNFOLLOW);
      } catch {
        toast.error(t`User rejected request`);
      } finally {
        setWriteLoading(false);
      }
    },
    onError
  });

  const createUnfollow = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      await createUnfollowTypedData({ variables: { request: { profile: profile?.id } } });
    } catch {}
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline
      onClick={createUnfollow}
      disabled={typedDataLoading || signLoading || writeLoading}
      variant="danger"
      aria-label="Unfollow"
      icon={
        typedDataLoading || signLoading || writeLoading ? (
          <Spinner variant="danger" size="xs" />
        ) : (
          <UserRemoveIcon className="h-4 w-4" />
        )
      }
    >
      {showText && t`Unfollow`}
    </Button>
  );
};

export default Unfollow;
