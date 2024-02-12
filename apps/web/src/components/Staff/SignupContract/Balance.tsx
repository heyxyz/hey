import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import { formatUnits } from 'viem';
import { useBalance, useWriteContract } from 'wagmi';

import NumberedStat from '../UI/NumberedStat';

const Balance: FC = () => {
  const [loading, setLoading] = useState(false);

  const { data } = useBalance({
    address: HEY_LENS_SIGNUP,
    query: { refetchInterval: 2000 }
  });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: errorToast,
      onSuccess: () => {
        Leafwatch.track(STAFFTOOLS.SIGNUP_CONTRACT.WITHDRAW_FUNDS);
        setLoading(true);
      }
    }
  });

  const withdraw = async () => {
    try {
      setLoading(true);

      return await writeContractAsync({
        abi: HeyLensSignup,
        address: HEY_LENS_SIGNUP,
        functionName: 'withdrawFunds'
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <NumberedStat
        count={
          (data && parseFloat(formatUnits(data.value, 18)))?.toString() || '0'
        }
        name={`Balance`}
        suffix="MATIC"
      />
      <Button
        className="w-full justify-center"
        disabled={loading}
        icon={
          loading ? (
            <Spinner className="mr-0.5" size="xs" />
          ) : (
            <CurrencyDollarIcon className="size-5" />
          )
        }
        onClick={withdraw}
      >
        Withdraw Funds
      </Button>
    </div>
  );
};

export default Balance;
