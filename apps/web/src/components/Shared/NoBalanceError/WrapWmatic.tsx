import type { Amount } from "@hey/lens";
import type { FC, ReactNode } from "react";

import errorToast from "@helpers/errorToast";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Button, Spinner } from "@hey/ui";
import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";

import IndexStatus from "../IndexStatus";

interface WrapWmaticProps {
  errorMessage?: ReactNode;
  moduleAmount: Amount;
}

const WrapWmatic: FC<WrapWmaticProps> = ({ errorMessage, moduleAmount }) => {
  const [isLoading, setIsLoading] = useState(false);

  const amount = moduleAmount?.value;
  const currency = moduleAmount?.asset?.symbol;
  const assetAddress = moduleAmount?.asset?.contract.address;

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { data: writeHash, writeContractAsync } = useWriteContract({
    mutation: { onError }
  });

  const writeAsync = () => {
    return writeContractAsync({
      abi: [
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: "dst", type: "address" },
            { indexed: false, name: "wad", type: "uint256" }
          ],
          name: "Deposit",
          type: "event"
        },
        {
          constant: false,
          inputs: [],
          name: "deposit",
          outputs: [],
          payable: true,
          stateMutability: "payable",
          type: "function"
        }
      ],
      address: assetAddress,
      functionName: "deposit",
      value: parseEther(amount)
    });
  };

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
      {writeHash ? (
        <IndexStatus
          message={`Wrapping MATIC to ${currency}...`}
          txHash={writeHash}
        />
      ) : (
        <>
          <div className="mb-1 text-sm">
            {errorMessage ? (
              errorMessage
            ) : (
              <span>
                You don't have enough <b>{currency}</b>
              </span>
            )}
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
            Wrap POL to {currency}
          </Button>
        </>
      )}
    </div>
  );
};

export default WrapWmatic;
