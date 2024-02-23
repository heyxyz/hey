import type {
  Amount,
  ApprovedAllowanceAmountResult,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';

import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { useApprovedModuleAllowanceAmountQuery } from '@hey/lens';
import { Button, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import getCurrentSession from '@lib/getCurrentSession';
import { useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';

interface DecentActionProps {
  act: () => void;
  className?: string;
  isLoading?: boolean;
  module: UnknownOpenActionModuleSettings;
  moduleAmount?: Amount;
  title: string;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  className = '',
  isLoading = false,
  module,
  moduleAmount,
  title
}) => {
  const [allowed, setAllowed] = useState(true);
  const { id: sessionProfileId } = getCurrentSession();
  const isWalletUser = isAddress(sessionProfileId);

  const { address } = useAccount();

  const amount = parseInt(moduleAmount?.value || '0');
  const assetAddress = moduleAmount?.asset?.contract.address;
  const assetDecimals = moduleAmount?.asset?.decimals || 18;
  const assetSymbol = moduleAmount?.asset?.symbol;

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        if (!amount) {
          return;
        }

        const allowedAmount = parseFloat(
          approvedModuleAllowanceAmount[0]?.allowance.value
        );
        setAllowed(allowedAmount > amount);
      },
      skip: !amount || !sessionProfileId || !assetAddress,
      variables: {
        request: {
          currencies: [assetAddress],
          unknownOpenActionModules: [module.contract.address]
        }
      }
    });

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

  if (!sessionProfileId) {
    return (
      <div className="w-full">
        <LoginButton isBig isFullWidth title="Login to Mint" />
      </div>
    );
  }

  if (isWalletUser) {
    return null;
  }

  if (allowanceLoading) {
    return (
      <div className={cn('shimmer h-[34px] w-28 rounded-lg', className)} />
    );
  }

  if (!hasAmount) {
    return (
      <Button
        className="w-full border-gray-300 bg-gray-300 text-gray-600 hover:bg-gray-300 hover:text-gray-600"
        disabled={true}
        size="lg"
      >
        {`Insufficient ${assetSymbol} balance`}
      </Button>
    );
  }

  if (!allowed) {
    return (
      <AllowanceButton
        allowed={allowed}
        className={className}
        module={
          allowanceData
            ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
        }
        setAllowed={setAllowed}
        title={`Approve ${assetSymbol} Token Allowance`}
      />
    );
  }

  return (
    <Button
      className={className}
      disabled={isLoading}
      icon={isLoading ? <Spinner size="xs" /> : null}
      onClick={act}
    >
      {title}
    </Button>
  );
};

export default DecentAction;
