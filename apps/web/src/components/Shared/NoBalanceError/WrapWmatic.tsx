import { InboxIcon } from '@heroicons/react/24/outline';
import type { Amount } from '@hey/lens';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { type FC, useState } from 'react';
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
    address: assetAddress,
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
    functionName: 'deposit',
    value: parseEther(amount),
    onError
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
          txHash={data.hash}
          message={`Wrapping MATIC to ${currency}...`}
        />
      ) : (
        <>
          <div className="mb-1 text-sm">
            You don't have enough <b>{currency}</b>
          </div>
          <Button
            onClick={deposit}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : (
                <InboxIcon className="h-4 w-4" />
              )
            }
            disabled={isLoading}
          >
            Wrap MATIC to {currency}
          </Button>
        </>
      )}
    </div>
  );
};

export default WrapWmatic;
