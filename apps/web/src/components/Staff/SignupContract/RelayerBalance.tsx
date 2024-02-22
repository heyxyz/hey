import type { Address } from 'viem';

import { STAFFTOOLS } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import { formatUnits, parseEther } from 'viem';
import { useBalance, useSendTransaction } from 'wagmi';

import NumberedStat from '../UI/NumberedStat';

interface RelayerBalanceProps {
  address: Address;
  index: number;
}

const RelayerBalance: FC<RelayerBalanceProps> = ({ address, index }) => {
  const [loading, setLoading] = useState(false);

  const { data } = useBalance({
    address: address,
    query: { refetchInterval: 5000 }
  });

  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onError: errorToast,
      onSuccess: () => {
        Leafwatch.track(STAFFTOOLS.SIGNUP_CONTRACT.REFILL, {
          relayer: index + 1
        });
        setLoading(true);
      }
    }
  });

  const balance = data ? parseFloat(formatUnits(data.value, 18)) : 0;

  const refill = async () => {
    try {
      setLoading(true);

      return await sendTransactionAsync({
        to: address,
        value: parseEther(balance < 20 ? (20 - balance).toString() : '0')
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NumberedStat
      action={
        <Button
          className="w-full justify-center"
          disabled={loading}
          onClick={refill}
          size="sm"
        >
          Refill Balance
        </Button>
      }
      count={balance.toString()}
      name={`Relayer ${index + 1}`}
      suffix="MATIC"
    />
  );
};

export default RelayerBalance;
