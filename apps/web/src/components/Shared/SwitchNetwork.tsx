import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { SYSTEM } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { type FC } from 'react';
import { useSwitchNetwork } from 'wagmi';

import { Leafwatch } from '@/lib/leafwatch';

interface SwitchNetworkProps {
  toChainId: number;
  title?: string;
  className?: string;
  onSwitch?: () => void;
}

const SwitchNetwork: FC<SwitchNetworkProps> = ({
  toChainId,
  title = 'Switch Network',
  className = '',
  onSwitch
}) => {
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      icon={<ArrowsRightLeftIcon className="h-4 w-4" />}
      onClick={() => {
        onSwitch?.();
        switchNetwork?.(toChainId);
        Leafwatch.track(SYSTEM.SWITCH_NETWORK, {
          chain: toChainId
        });
      }}
    >
      {title}
    </Button>
  );
};

export default SwitchNetwork;
