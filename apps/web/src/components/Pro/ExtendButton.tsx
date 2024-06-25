import type { FC } from 'react';

import errorToast from '@helpers/errorToast';
import { Leafwatch } from '@helpers/leafwatch';
import { Errors } from '@hey/data';
import { PAGEVIEW } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { parseEther } from 'viem';
import { useSendTransaction, useTransaction } from 'wagmi';

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

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'pro' });
  }, []);

  const { isSuspended } = useProfileStatus();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onError: errorToast,
      onSuccess: (hash: string) => {
        setTransactionHash(hash as `0x${string}`);
      }
    }
  });
  const { isFetching: transactionLoading, isSuccess } = useTransaction({
    hash: transactionHash as `0x${string}`,
    query: { enabled: Boolean(transactionHash) }
  });

  useEffect(() => {
    if (isSuccess) {
      location.reload();
    }
  }, [isSuccess]);

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

      return await sendTransactionAsync({
        data: '0x0d',
        to: '0xF618330F51fa54Ce5951d627Ee150c0fDADeBA43',
        value: parseEther('10')
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
