import type { FC } from 'react';

import errorToast from '@helpers/errorToast';
import { Errors } from '@hey/data';
import { MONTHLY_PRO_PRICE, PRO_EOA_ADDRESS } from '@hey/data/constants';
import { Button } from '@hey/ui';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { parseEther } from 'viem';
import { useSendTransaction, useTransactionReceipt } from 'wagmi';

interface ExtendButtonProps {
  size?: 'lg' | 'md';
}

const ExtendButton: FC<ExtendButtonProps> = ({ size = 'lg' }) => {
  const { currentProfile } = useProfileStore();
  const { isPro } = useProStore();

  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(
    null
  );

  const handleWrongNetwork = useHandleWrongNetwork();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onError: errorToast,
      onSuccess: (hash: string) => setTransactionHash(hash as `0x${string}`)
    }
  });

  const { isFetching: transactionLoading, isSuccess } = useTransactionReceipt({
    hash: transactionHash as `0x${string}`,
    query: { enabled: Boolean(transactionHash) }
  });

  useEffect(() => {
    if (isSuccess) {
      location.reload();
    }
  }, [isSuccess]);

  const upgrade = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();

      await sendTransactionAsync({
        data: currentProfile.id,
        to: PRO_EOA_ADDRESS,
        value: parseEther(MONTHLY_PRO_PRICE.toString())
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
      onClick={upgrade}
      size={size}
    >
      {transactionLoading
        ? 'Transaction pending...'
        : isPro
          ? `Extend a Month`
          : 'Upgrade to Pro'}
    </Button>
  );
};

export default ExtendButton;
