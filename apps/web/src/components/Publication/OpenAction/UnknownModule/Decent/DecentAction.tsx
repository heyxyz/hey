import type { Amount } from "@hey/lens";
import type { UIData } from "nft-openaction-kit";
import type { FC } from "react";

import LoginButton from "@components/Shared/LoginButton";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { Button, Spinner } from "@hey/ui";
import cn from "@hey/ui/cn";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

import { openActionCTA } from ".";

interface DecentActionProps {
  act: () => void;
  allowanceLoading?: boolean;
  className?: string;
  isLoading?: boolean;
  isLoadingActionData?: boolean;
  isReadyToMint?: boolean;
  moduleAmount?: Amount;
  uiData?: null | UIData;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  allowanceLoading,
  className = "",
  isLoading = false,
  isLoadingActionData = false,
  isReadyToMint,
  moduleAmount,
  uiData
}) => {
  const { address } = useAccount();

  const amount = Number.parseInt(moduleAmount?.value || "0");
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;
  const assetSymbol = moduleAmount?.asset?.symbol;

  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: assetAddress
  });

  let hasAmount = false;
  if (
    balanceData &&
    Number.parseFloat(formatUnits(balanceData.value, assetDecimals)) < amount
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  if (!address) {
    return (
      <div className="w-full">
        <LoginButton isBig isFullWidth title="Login to Mint" />
      </div>
    );
  }

  if (allowanceLoading) {
    return (
      <div className={cn("shimmer h-[38px] w-28 rounded-full", className)} />
    );
  }

  if (!hasAmount) {
    return (
      <Button className="w-full" disabled size="lg">
        Insufficient {assetSymbol} balance
      </Button>
    );
  }

  return (
    <Button
      className={className}
      disabled={isLoading || isLoadingActionData}
      icon={isLoading || isLoadingActionData ? <Spinner size="xs" /> : null}
      onClick={(e) => {
        stopEventPropagation(e);
        act();
      }}
      size="lg"
    >
      {isLoading
        ? "Pending"
        : isLoadingActionData
          ? "Loading..."
          : !isReadyToMint
            ? `Approve ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`
            : `${openActionCTA(uiData?.platformName)} for ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`}
    </Button>
  );
};

export default DecentAction;
