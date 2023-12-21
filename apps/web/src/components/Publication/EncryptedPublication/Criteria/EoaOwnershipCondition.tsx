import type { FC } from 'react';

import { EoaOwnershipCondition } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import { Tooltip } from '@hey/ui';
import useEnsName from 'src/hooks/useEnsName';

interface EoaOwnershipConditionProps {
  condition: EoaOwnershipCondition;
}

const EoaOwnershipCondition: FC<EoaOwnershipConditionProps> = ({
  condition
}) => {
  const { ens } = useEnsName({
    address: condition.address,
    enabled: Boolean(condition.address)
  });
  const ensName = condition.address === ens ? null : ens;

  return (
    <div className="flex items-center space-x-2">
      <div>Must own the EVM Address:</div>
      <div>
        <Tooltip content={condition.address}>
          {formatAddress(condition.address)} {ensName ? `(${ensName})` : null}
        </Tooltip>
      </div>
    </div>
  );
};

export default EoaOwnershipCondition;
