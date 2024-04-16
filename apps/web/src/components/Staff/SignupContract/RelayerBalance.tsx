import type { FC } from 'react';
import type { Address } from 'viem';

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { formatUnits, parseEther } from 'viem';
import { useBalance, useReadContract, useSendTransaction } from 'wagmi';

import NumberedStat from '../UI/NumberedStat';

interface RelayerBalanceProps {
  address: Address;
  index: number;
}

const RelayerBalance: FC<RelayerBalanceProps> = ({ address, index }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const { data } = useBalance({
    address: address,
    query: { refetchInterval: 5000 }
  });

  const { data: allowed } = useReadContract({
    abi: HeyLensSignup,
    address: HEY_LENS_SIGNUP,
    args: [address],
    functionName: 'allowedAddresses'
  });

  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onError: errorToast,
      onSuccess: () => {
        Leafwatch.track(STAFFTOOLS.SIGNUP_CONTRACT.REFILL, {
          relayer: index + 1
        });
        setIsLoading(true);
      }
    }
  });

  const balance = data ? parseFloat(formatUnits(data.value, 18)) : 0;

  const refill = async () => {
    try {
      setIsLoading(true);
      await handleWrongNetwork();

      // Refill balance to 10 MATIC
      return await sendTransactionAsync({
        to: address,
        value: parseEther(balance < 10 ? (10 - balance).toString() : '0')
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NumberedStat
      action={
        index !== 0 && (
          <Button
            className="w-full justify-center"
            disabled={isLoading}
            onClick={refill}
            outline
            size="sm"
          >
            Refill Balance
          </Button>
        )
      }
      count={balance.toFixed(3).toString()}
      name={
        <div className="flex items-center space-x-2">
          <span>{index === 0 ? 'Root Relayer' : `Relayer ${index}`}</span>
          {index !== 0 ? (
            allowed ? (
              <CheckCircleIcon className="size-4 text-green-500" />
            ) : (
              <XMarkIcon className="size-4 text-red-500" />
            )
          ) : null}
        </div>
      }
      suffix="MATIC"
    />
  );
};

export default RelayerBalance;
