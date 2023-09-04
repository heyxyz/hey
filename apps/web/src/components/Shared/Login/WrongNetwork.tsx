import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useGlobalModalStateStore } from 'src/store/modals';

import SwitchNetwork from '../SwitchNetwork';

const WrongNetwork: FC = () => {
  const setShowWrongNetworkModal = useGlobalModalStateStore(
    (state) => state.setShowWrongNetworkModal
  );

  return (
    <div className="p-5">
      <div className="mb-4 space-y-1">
        <div className="text-xl font-bold">
          <Trans>Change network</Trans>.
        </div>
        <div className="lt-text-gray-500 text-sm">
          <Trans>Connect to the correct network to continue</Trans>
        </div>
      </div>
      <SwitchNetwork
        toChainId={CHAIN_ID}
        onSwitch={() => setShowWrongNetworkModal(false)}
      />
    </div>
  );
};

export default WrongNetwork;
