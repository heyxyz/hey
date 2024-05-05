import type { MirrorablePublication } from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';
import type { FC } from 'react';
import type { Address } from 'viem';

import errorToast from '@helpers/errorToast';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { HeyTipping } from '@hey/abis';
import { Errors } from '@hey/data';
import {
  APP_NAME,
  DEFAULT_COLLECT_TOKEN,
  HEY_API_URL,
  HEY_TIPPING,
  MAX_UINT256,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import formatAddress from '@hey/helpers/formatAddress';
import { Button, HelpTooltip, Input, Select, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import axios from 'axios';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useTipsStore } from 'src/store/non-persisted/useTipsStore';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { formatUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

const submitButtonClassName = 'w-full py-1.5 text-sm font-semibold';

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
  const { addTip } = useTipsStore();
  const { fiatRates } = useRatesStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(2);
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

  const { data, isLoading: isGettingAllowance } = useReadContract({
    abi: HeyTipping,
    address: HEY_TIPPING,
    args: [selectedCurrency?.contractAddress, address],
    functionName: 'checkAllowance',
    query: { refetchInterval: 2000 }
  });

  const { data: txHash, writeContractAsync } = useWriteContract();

  const { isLoading: isWaitingForTransaction } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) }
  });

  if (!currentProfile) {
    return (
      <div className="m-5">
        <Button
          className={submitButtonClassName}
          onClick={() => {
            if (!currentProfile) {
              closePopover();
              setShowAuthModal(true);
              return;
            }
          }}
        >
          Log in to tip
        </Button>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="m-5 space-y-3 text-sm font-bold">
        <div>Connect to correct wallet to tip!</div>
        <div className="ld-text-gray-500">
          Switch to: {formatAddress(currentProfile?.ownedBy.address)}
        </div>
      </div>
    );
  }

  const allowance = parseFloat(data?.toString() || '0');
  const usdRate =
    fiatRates.find(
      (rate) => rate.address === selectedCurrency?.contractAddress.toLowerCase()
    )?.fiat || 0;
  const cryptoRate = !usdRate ? amount : Number((amount / usdRate).toFixed(2));
  const finalRate = cryptoRate * 10 ** (selectedCurrency?.decimals || 18);

  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals || 18)
      ).toFixed(3)
    : 0;
  const canTip = Number(balance) >= cryptoRate;

  const onSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const enableTipping = async () => {
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
            name: 'approve',
            outputs: [{ internalType: 'bool', type: 'bool' }],
            type: 'function'
          }
        ],
        address: selectedCurrency?.contractAddress as Address,
        args: [HEY_TIPPING, MAX_UINT256],
        functionName: 'approve'
      });
      Leafwatch.track(PUBLICATION.TIP.ENABLE, {
        address,
        currency: selectedCurrency?.symbol
      });
      return;
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTip = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      const hash = await writeContractAsync({
        abi: HeyTipping,
        address: HEY_TIPPING,
        args: [
          selectedCurrency?.contractAddress,
          publication.by.ownedBy.address,
          finalRate,
          currentProfile?.id,
          publication.by.id,
          publication.id.split('-')[1]
        ],
        functionName: 'tip'
      });

      await axios.post(
        `${HEY_API_URL}/tips/create`,
        {
          amount: cryptoRate - cryptoRate * 0.05,
          fromAddress: address,
          id: publication.id,
          toAddress: publication.by.ownedBy.address,
          tokenAddress: selectedCurrency?.contractAddress,
          txHash: hash
        },
        { headers: getAuthApiHeaders() }
      );

      Leafwatch.track(PUBLICATION.TIP.TIP, {
        address,
        amount,
        currency: selectedCurrency?.symbol
      });
      addTip(publication.id);
      closePopover();
      triggerConfetti();
      return;
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAllowance = allowance >= finalRate;
  const amountDisabled =
    isLoading ||
    !currentProfile ||
    !hasAllowance ||
    isWaitingForTransaction ||
    isGettingAllowance;

  return (
    <div className="m-5 space-y-3">
      <div className="space-y-2">
        <Select
          className="py-1.5 text-sm"
          iconClassName="size-4"
          onChange={(value) => {
            setAmount(2);
            setSelectedCurrency(
              allowedTokens?.find((token) => token.contractAddress === value) ||
                null
            );
          }}
          options={allowedTokens?.map((token) => ({
            icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
            label: token.name,
            selected:
              token.contractAddress === selectedCurrency?.contractAddress,
            value: token.contractAddress
          }))}
        />
        <div className="ld-text-gray-500 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <span>Balance:</span>
            <span>
              {balanceData ? (
                `${balance} ${selectedCurrency?.symbol}`
              ) : (
                <div className="shimmer h-2.5 w-14 rounded-full" />
              )}
            </span>
          </div>
          <HelpTooltip>
            <div className="py-1">
              <b>Fees</b>
              <div className="flex items-start space-x-10">
                <div className="flex items-center space-x-2">
                  <img
                    className="size-3"
                    src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
                  />
                  <span>{APP_NAME}</span>
                </div>
                <b>
                  {(cryptoRate * 0.05).toFixed(3)} {selectedCurrency?.symbol}{' '}
                  (5%)
                </b>
              </div>
            </div>
          </HelpTooltip>
        </div>
      </div>
      <div className="space-x-4">
        <Button
          disabled={amountDisabled}
          onClick={() => onSetAmount(2)}
          outline={amount !== 2}
          size="sm"
        >
          {usdRate ? '$' : ''}2
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => onSetAmount(5)}
          outline={amount !== 5}
          size="sm"
        >
          {usdRate ? '$' : ''}5
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => onSetAmount(10)}
          outline={amount !== 10}
          size="sm"
        >
          {usdRate ? '$' : ''}10
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => {
            onSetAmount(other ? 2 : 20);
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
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
      {isLoading || isWaitingForTransaction || isGettingAllowance ? (
        <Button
          className={cn('flex justify-center', submitButtonClassName)}
          disabled
          icon={<Spinner className="my-0.5" size="xs" />}
        />
      ) : !hasAllowance ? (
        <Button
          className={submitButtonClassName}
          disabled={isLoading}
          onClick={enableTipping}
        >
          Enable tipping for {selectedCurrency?.symbol}
        </Button>
      ) : (
        <Button
          className={submitButtonClassName}
          disabled={!amount || isLoading || !canTip}
          onClick={handleTip}
        >
          {usdRate ? (
            <>
              <b>Tip ${amount}</b>{' '}
              <span className="font-light">
                ({cryptoRate} {selectedCurrency?.symbol})
              </span>
            </>
          ) : (
            <b>
              Tip {amount} {selectedCurrency?.symbol}
            </b>
          )}
        </Button>
      )}
    </div>
  );
};

export default Action;
