import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { SYSTEM } from 'src/tracking';
import { Button } from 'ui';
import { useSwitchNetwork } from 'wagmi';

interface SwitchNetworkProps {
  className?: string;
}

const SwitchNetwork: FC<SwitchNetworkProps> = ({ className = '' }) => {
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      leadingIcon={<SwitchHorizontalIcon className="h-4 w-4" />}
      onClick={() => {
        if (switchNetwork) {
          switchNetwork(CHAIN_ID);
        } else {
          toast.error(t`Please change your network wallet!`);
        }
        Mixpanel.track(SYSTEM.SWITCH_NETWORK);
      }}
    >
      <Trans>Switch Network</Trans>
    </Button>
  );
};

export default SwitchNetwork;
