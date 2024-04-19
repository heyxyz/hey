import type { MirrorablePublication } from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';

import { Errors } from '@hey/data';
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from '@hey/data/constants';
import { Button, Input, Select } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { type FC, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokens';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { type Address, formatUnits } from 'viem';
import { useAccount, useBalance, useWriteContract } from 'wagmi';

interface ActionProps {
  closePopover: () => void;
  publication: MirrorablePublication;
  triggerConfetti: () => void;
}

const Action: FC<ActionProps> = ({
  closePopover,
  publication,
  triggerConfetti
}) => {
  const { currentProfile } = useProfileStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(50);
  const [other, setOther] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    allowedTokens.find(
      (token) => token.contractAddress === DEFAULT_COLLECT_TOKEN
    ) || null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  const { isSuspended } = useProfileRestriction();

  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: selectedCurrency?.contractAddress as Address
  });

  const { writeContractAsync } = useWriteContract();

  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals || 18)
      ).toFixed(3)
    : 0;
  const canTip = Number(balance) >= amount;

  const onSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const handleTip = async () => {
    if (!currentProfile) {
      closePopover();
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      await writeContractAsync({
        abi: [
          {
            inputs: [
              { internalType: 'address', type: 'address' },
              { internalType: 'uint256', type: 'uint256' }
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', type: 'bool' }],
            type: 'function'
          }
        ],
        address: selectedCurrency?.contractAddress as Address,
        args: [
          publication.by.ownedBy.address,
          amount * 10 ** (selectedCurrency?.decimals || 18)
        ],
        functionName: 'transfer'
      });

      closePopover();
      triggerConfetti();
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-5 space-y-3">
      <Select
        className="py-1.5 text-sm"
        iconClassName="size-4"
        onChange={(value) => {
          setSelectedCurrency(
            allowedTokens?.find((token) => token.contractAddress === value) ||
              null
          );
        }}
        options={allowedTokens?.map((token) => ({
          icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
          label: token.name,
          selected: token.contractAddress === selectedCurrency?.contractAddress,
          value: token.contractAddress
        }))}
      />
      <div className="ld-text-gray-500 flex items-center space-x-1 text-xs">
        <span>Balance:</span>
        <span>
          {balanceData ? (
            `${balance} ${selectedCurrency?.symbol}`
          ) : (
            <div className="shimmer h-2.5 w-14 rounded-full" />
          )}
        </span>
      </div>
      <div className="space-x-2">
        <Button
          disabled={!currentProfile}
          onClick={() => onSetAmount(50)}
          outline={amount !== 50}
          size="sm"
        >
          50
        </Button>
        <Button
          disabled={!currentProfile}
          onClick={() => onSetAmount(100)}
          outline={amount !== 100}
          size="sm"
        >
          100
        </Button>
        <Button
          disabled={!currentProfile}
          onClick={() => onSetAmount(200)}
          outline={amount !== 200}
          size="sm"
        >
          200
        </Button>
        <Button
          disabled={!currentProfile}
          onClick={() => {
            onSetAmount(other ? 50 : 300);
            setOther(!other);
          }}
          outline={!other}
          size="sm"
        >
          Other
        </Button>
      </div>
      {other ? (
        <div>
          <Input
            className="no-spinner"
            max={1000 || 0}
            min={1}
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
      {currentProfile ? (
        <Button
          className="w-full"
          disabled={amount < 1 || isLoading || !canTip}
          onClick={handleTip}
        >
          Tip {amount} {selectedCurrency?.symbol}
        </Button>
      ) : (
        <Button className="w-full" onClick={handleTip}>
          Log in to tip
        </Button>
      )}
    </div>
  );
};

export default Action;
