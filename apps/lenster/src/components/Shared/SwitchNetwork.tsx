import { Button } from '@components/UI/Button';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { SYSTEM } from 'src/tracking';
import { useSwitchNetwork } from 'wagmi';

interface Props {
  className?: string;
}

const SwitchNetwork: FC<Props> = ({ className = '' }) => {
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      icon={<SwitchHorizontalIcon className="w-4 h-4" />}
      onClick={() => {
        if (switchNetwork) {
          switchNetwork(CHAIN_ID);
        } else {
          toast.error('Please change your network wallet!');
        }
        Mixpanel.track(SYSTEM.SWITCH_NETWORK);
      }}
    >
      Switch Network
    </Button>
  );
};

export default SwitchNetwork;
