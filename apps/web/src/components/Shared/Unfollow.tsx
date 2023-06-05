import { UserRemoveIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import { FollowNft } from 'abis';
import type { Profile } from 'lens';
import { useFollowersNftOwnedTokenIdsQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Spinner } from 'ui';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { PROFILE } from '../../tracking';

interface UnfollowProps {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
}

const Unfollow: FC<UnfollowProps> = ({ profile, showText = false, setFollowing }) => {
  const { address } = useAccount();

  const { data } = useFollowersNftOwnedTokenIdsQuery({
    variables: { request: { address, profileId: profile.id } }
  });

  const followerNftOwnedTokenIds = data?.followerNftOwnedTokenIds;

  const { config, isError, error } = usePrepareContractWrite({
    address: profile?.followNftAddress,
    abi: FollowNft,
    functionName: 'burn',
    args: [followerNftOwnedTokenIds?.tokensIds[0]],
    enabled: Boolean(followerNftOwnedTokenIds?.tokensIds?.length)
  });

  const { data: txData, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: txData?.hash
  });

  const handleUnfollow = async () => {
    try {
      write?.();
    } catch {
      toast.error(t`User rejected request`);
    }
  };

  useEffect(() => {
    if (setFollowing && isSuccess) {
      setFollowing(false);
      toast.success(t`Unfollowed successfully!`);
      Mixpanel.track(PROFILE.UNFOLLOW);
    }
  }, [isSuccess, setFollowing]);

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline
      onClick={handleUnfollow}
      disabled={isLoading || !write || isError}
      variant="danger"
      aria-label="Unfollow"
      icon={isLoading ? <Spinner variant="danger" size="xs" /> : <UserRemoveIcon className="h-4 w-4" />}
    >
      {showText && t`Unfollow`}
    </Button>
  );
};

export default Unfollow;
