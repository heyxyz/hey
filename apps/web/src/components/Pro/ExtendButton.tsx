import type { FC } from 'react';

import { GoodPro } from '@good/abis';
import { Errors } from '@good/data';
import { GOOD_PRO, PRO_TIER_PRICES } from '@good/data/constants';
import { PAGEVIEW } from '@good/data/tracking';
import { Button } from '@good/ui';
import errorToast from '@helpers/errorToast';
import { Leafwatch } from '@helpers/leafwatch';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { parseEther } from 'viem';
import { useTransaction, useWriteContract } from 'wagmi';

interface ExtendButtonProps {
  outline?: boolean;
  size?: 'lg' | 'md';
  tier: 'annually' | 'monthly';
}

const ExtendButton: FC<ExtendButtonProps> = ({
  outline = false,
  size = 'lg',
  tier
}) => {
  const { currentProfile } = useProfileStore();
  const { isPro } = useProStore();

  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(
    null
  );

  const { isSuspended } = useProfileStatus();
  const handleWrongNetwork = useHandleWrongNetwork();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'pro' });
  }, []);

  const { isFetching: transactionLoading, isSuccess } = useTransaction({
    hash: transactionHash as `0x${string}`,
    query: { enabled: Boolean(transactionHash) }
  });

  useEffect(() => {
    if (isSuccess) {
      location.reload();
    }
  }, [isSuccess]);

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: errorToast,
      onSuccess: (hash: string) => {
        // Leafwatch.track(AUTH.SIGNUP, { price: SIGNUP_PRICE, via: 'crypto' });
        setTransactionHash(hash as `0x${string}`);
      }
    }
  });

  const upgrade = async (id: 'annually' | 'monthly') => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();

      return await writeContractAsync({
        abi: GoodPro,
        address: GOOD_PRO,
        args: [currentProfile.id],
        functionName: id === 'monthly' ? 'subscribeMonthly' : 'subscribeYearly',
        value: parseEther(
          id === 'monthly'
            ? PRO_TIER_PRICES.monthly.toString()
            : PRO_TIER_PRICES.annually.toString()
        )
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="mt-3 w-full"
      disabled={isLoading || transactionLoading}
      onClick={() => upgrade(tier as 'annually' | 'monthly')}
      outline={outline}
      size={size}
    >
      {transactionLoading
        ? 'Transaction pending...'
        : isPro
          ? `Extend a ${tier === 'monthly' ? 'Month' : 'Year'}`
          : 'Upgrade to Pro'}
    </Button>
  );
};

export default ExtendButton;
