import type { Amount } from '@hey/lens';
import type { UIData } from 'nft-openaction-kit';
import type { FC } from 'react';

import LoginButton from '@components/Shared/LoginButton';
import MetaDetails from '@components/Shared/MetaDetails';
import { LinkIcon } from '@heroicons/react/24/outline';
import { LAYERZEROSCAN_URL, POLYGONSCAN_URL } from '@hey/data/constants';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { openActionCTA } from '.';

interface DecentActionProps {
  act: () => void;
  allowanceLoading?: boolean;
  className?: string;
  isLoading?: boolean;
  isReadyToMint?: boolean;
  loadingCurrency?: boolean;
  moduleAmount?: Amount;
  txHash?: string;
  uiData?: UIData;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  allowanceLoading,
  className = '',
  isLoading = false,
  isReadyToMint,
  loadingCurrency,
  moduleAmount,
  txHash,
  uiData
}) => {
  const { address } = useAccount();

  const amount = parseInt(moduleAmount?.value || '0');
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;
  const assetSymbol = moduleAmount?.asset?.symbol;
  const loadingState: boolean = isLoading;

  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: assetAddress
  });

  let hasAmount = false;
  if (
    balanceData &&
    parseFloat(formatUnits(balanceData.value, assetDecimals)) < amount
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

  if (loadingCurrency) {
    return (
      <div
        className={cn(
          'shimmer flex h-[38px] items-center justify-center rounded-full px-5 py-1.5',
          className
        )}
      >
        <p className="ld-text-gray-500">Computing price...</p>
      </div>
    );
  }

  if (allowanceLoading) {
    return (
      <div className={cn('shimmer h-[34px] w-28 rounded-lg', className)} />
    );
  }

  if (!hasAmount) {
    return (
      <Button className="w-full" disabled={true} size="lg">
        {`Insufficient ${assetSymbol} balance`}
      </Button>
    );
  }

  return (
    <>
      <Button
        className={className}
        disabled={loadingState}
        icon={loadingState ? <Spinner size="xs" /> : null}
        onClick={(e) => {
          stopEventPropagation(e);
          act();
        }}
        size="lg"
      >
        {loadingState
          ? 'Pending'
          : !isReadyToMint
            ? `Approve ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`
            : `${openActionCTA(uiData?.platformName)} for ${moduleAmount?.value} ${moduleAmount?.asset.symbol}`}
      </Button>
      {txHash ? (
        <>
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 size-4" />}
            title="PolygonScan"
            value={`${POLYGONSCAN_URL}/tx/${txHash}`}
          >
            <Link
              href={`${POLYGONSCAN_URL}/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              Open
            </Link>
          </MetaDetails>
          <MetaDetails
            icon={<LinkIcon className="ld-text-gray-500 size-4" />}
            title="LayerZeroScan"
            value={`${LAYERZEROSCAN_URL}/tx/${txHash}`}
          >
            <Link
              href={`${LAYERZEROSCAN_URL}tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              Open
            </Link>
          </MetaDetails>
        </>
      ) : null}
    </>
  );
};

export default DecentAction;
