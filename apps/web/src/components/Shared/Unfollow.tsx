import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { UserRemoveIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { t } from '@lingui/macro';
import { FollowNFT } from 'abis';
import { SIGN_WALLET } from 'data/constants';
import type { Signer } from 'ethers';
import { Contract } from 'ethers';
import type { CreateBurnEip712TypedData, Profile } from 'lens';
import { useBroadcastMutation, useCreateUnfollowTypedDataMutation } from 'lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';
import { useSigner, useSignTypedData } from 'wagmi';

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
}

const Unfollow: FC<Props> = ({ profile, showText = false, setFollowing }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [writeLoading, setWriteLoading] = useState(false);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
  const { data: signer } = useSigner();

  const burnWithSig = async (signature: string, typedData: CreateBurnEip712TypedData) => {
    const { tokenId, deadline } = typedData.value;
    const { v, r, s } = splitSignature(signature);
    const sig = { v, r, s, deadline };

    const followNftContract = new Contract(typedData.domain.verifyingContract, FollowNFT, signer as Signer);

    const tx = await followNftContract.burnWithSig(tokenId, sig);
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
        Analytics.track(PROFILE.UNFOLLOW);
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
      return toast.error(SIGN_WALLET);
    }

    try {
      await createUnfollowTypedData({ variables: { request: { profile: profile?.id } } });
    } catch {}
  };

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createUnfollow}
      disabled={typedDataLoading || signLoading || writeLoading}
      variant="danger"
      aria-label="Unfollow"
      icon={
        typedDataLoading || signLoading || writeLoading ? (
          <Spinner variant="danger" size="xs" />
        ) : (
          <UserRemoveIcon className="w-4 h-4" />
        )
      }
    >
      {showText && t`Unfollow`}
    </Button>
  );
};

export default Unfollow;
