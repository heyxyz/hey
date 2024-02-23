import type {
  Amount,
  ApprovedAllowanceAmountResult,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC, ReactNode } from 'react';

import AllowanceButton from '@components/Settings/Allowance/Button';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import NoBalanceError from '@components/Shared/NoBalanceError';
import { useApprovedModuleAllowanceAmountQuery } from '@hey/lens';
import { Button, Spinner, WarningMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import getCurrentSession from '@lib/getCurrentSession';
import { useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';

interface DecentActionProps {
  act: () => void;
  className?: string;
  icon: ReactNode;
  isLoading?: boolean;
  module: UnknownOpenActionModuleSettings;
  moduleAmount?: Amount;
  title: string;
}

const DecentAction: FC<DecentActionProps> = ({
  act,
  className = '',
  icon,
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
      <div>
        <LoginButton title="Login to Collect" />
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
      <WarningMessage
        className="w-full"
        message={<NoBalanceError moduleAmount={moduleAmount as Amount} />}
      />
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
        title="Approve WMATIC Token Allowance"
      />
    );
  }

  return (
    <Button
      className={className}
      disabled={isLoading}
      icon={isLoading ? <Spinner size="xs" /> : icon}
      onClick={act}
    >
      {title}
    </Button>
  );
};

export default DecentAction;
