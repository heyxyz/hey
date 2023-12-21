import type { Amount } from '@hey/lens';
import type { FC } from 'react';

import { InboxIcon } from '@heroicons/react/24/outline';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useContractWrite } from 'wagmi';

import IndexStatus from '../IndexStatus';

interface WrapWmaticProps {
  moduleAmount: Amount;
}

const WrapWmatic: FC<WrapWmaticProps> = ({ moduleAmount }) => {
  const [isLoading, setIsLoading] = useState(false);

  const amount = moduleAmount?.value;
  const currency = moduleAmount?.asset?.symbol;
  const assetAddress = moduleAmount?.asset?.contract.address;

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data, writeAsync } = useContractWrite({
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'dst',
            type: 'address'
          },
          {
            indexed: false,
            name: 'wad',
            type: 'uint256'
          }
        ],
        name: 'Deposit',
        type: 'event'
      },
      {
        constant: false,
        inputs: [],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      }
    ],
    address: assetAddress,
    functionName: 'deposit',
    onError,
    value: parseEther(amount)
  });

  const deposit = async () => {
    try {
      setIsLoading(true);
      return await writeAsync();
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      {data?.hash ? (
        <IndexStatus
          message={`Wrapping MATIC to ${currency}...`}
          txHash={data.hash}
        />
      ) : (
        <>
          <div className="mb-1 text-sm">
            You don't have enough <b>{currency}</b>
          </div>
          <Button
            disabled={isLoading}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : (
                <InboxIcon className="size-4" />
              )
            }
            onClick={deposit}
          >
            Wrap MATIC to {currency}
          </Button>
        </>
      )}
    </div>
  );
};

export default WrapWmatic;
