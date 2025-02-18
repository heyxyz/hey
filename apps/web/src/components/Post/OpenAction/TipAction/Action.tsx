import errorToast from "@helpers/errorToast";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { type AnyPost, useExecutePostActionMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import type { AllowedToken } from "@hey/types/hey";
import { Button, Input, Select, Spinner } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { ChangeEvent, FC, RefObject } from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useAllowedTokensStore } from "src/store/persisted/useAllowedTokensStore";
import { useRatesStore } from "src/store/persisted/useRatesStore";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import type { Address } from "viem";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";

const submitButtonClassName = "w-full py-1.5 text-sm font-semibold";

interface ActionProps {
  closePopover: () => void;
  post: AnyPost;
}

const Action: FC<ActionProps> = ({ closePopover, post }) => {
  const { currentAccount } = useAccountStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { fiatRates } = useRatesStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    allowedTokens.find(
      (token) => token.contractAddress === DEFAULT_COLLECT_TOKEN
    ) || null
  );
  const handleTransactionLifecycle = useTransactionLifecycle();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const { data: balanceData } = useBalance({
    address: currentAccount?.address,
    query: { refetchInterval: 2000 },
    token: selectedCurrency?.contractAddress as Address
  });

  const onCompleted = (hash: string) => {
    addOptimisticTransaction({
      collectOn: post?.id,
      txHash: hash,
      type: OptimisticTxType.CREATE_TIP
    });

    setIsLoading(false);
    closePopover();
    toast.success(`Tipped ${amount} ${selectedCurrency?.symbol}`);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const usdRate =
    fiatRates.find(
      (rate) => rate.address === selectedCurrency?.contractAddress.toLowerCase()
    )?.fiat || 0;
  const cryptoRate = usdRate ? Number((amount / usdRate).toFixed(2)) : amount;

  const balance = balanceData
    ? Number.parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals || 18)
      ).toFixed(3)
    : 0;
  const canTip = Number(balance) >= cryptoRate;

  const [executePostAction] = useExecutePostActionMutation({
    onCompleted: async ({ executePostAction }) => {
      if (executePostAction.__typename === "ExecutePostActionResponse") {
        return onCompleted(executePostAction.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: executePostAction,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const handleTip = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return executePostAction({
      variables: {
        request: {
          post: post.id,
          action: {
            tipping: {
              currency: selectedCurrency?.contractAddress as Address,
              value: cryptoRate.toString()
            }
          }
        }
      }
    });
  };

  const amountDisabled = isLoading || !currentAccount;

  if (!currentAccount) {
    return (
      <div className="m-5">
        <Button
          className={submitButtonClassName}
          onClick={() => {
            if (!currentAccount) {
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
      </div>
      <div className="space-x-4">
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(2)}
          outline={amount !== 2}
          size="sm"
        >
          {usdRate ? "$" : ""}2
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(5)}
          outline={amount !== 5}
          size="sm"
        >
          {usdRate ? "$" : ""}5
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(10)}
          outline={amount !== 10}
          size="sm"
        >
          {usdRate ? "$" : ""}10
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => {
            handleSetAmount(other ? 2 : 20);
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
            max={1000}
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
      {isLoading ? (
        <Button
          className={cn("flex justify-center", submitButtonClassName)}
          disabled
          icon={<Spinner className="my-0.5" size="xs" />}
        />
      ) : (
        <Button
          className={submitButtonClassName}
          disabled={!amount || isLoading || !canTip}
          onClick={handleTip}
        >
          {usdRate ? (
            <>
              <b>Tip ${amount}</b>{" "}
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
