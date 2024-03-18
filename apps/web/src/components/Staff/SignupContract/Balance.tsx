import type { FC } from 'react';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { formatUnits } from 'viem';
import { useBalance, useWriteContract } from 'wagmi';

import NumberedStat from '../UI/NumberedStat';

const Balance: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const { data } = useBalance({
    address: HEY_LENS_SIGNUP,
    query: { refetchInterval: 2000 }
  });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: errorToast,
      onSuccess: () => {
        Leafwatch.track(STAFFTOOLS.SIGNUP_CONTRACT.WITHDRAW_FUNDS);
        setIsLoading(true);
      }
    }
  });

  const withdraw = async () => {
    try {
      setIsLoading(true);
      await handleWrongNetwork();

      return await writeContractAsync({
        abi: HeyLensSignup,
        address: HEY_LENS_SIGNUP,
        functionName: 'withdrawFunds'
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
        onClick={withdraw}
      >
        Withdraw Funds
      </Button>
    </div>
  );
};

export default Balance;
