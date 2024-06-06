import type { FC } from 'react';

import { SYSTEM } from '@good/data/tracking';
import { Button } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useSwitchChain } from 'wagmi';

interface SwitchNetworkProps {
  className?: string;
  onSwitch?: () => void;
  title?: string;
  toChainId: number;
}

const SwitchNetwork: FC<SwitchNetworkProps> = ({
  className = '',
  onSwitch,
  title = 'Switch Network',
  toChainId
}) => {
  const { switchChain } = useSwitchChain();

  return (
    <Button
      className={className}
      icon={<ArrowsRightLeftIcon className="size-4" />}
      onClick={() => {
        onSwitch?.();
        switchChain?.({ chainId: toChainId });
        Leafwatch.track(SYSTEM.SWITCH_NETWORK, { chain: toChainId });
      }}
      type="button"
      variant="danger"
    >
      {title}
    </Button>
  );
};

export default SwitchNetwork;
