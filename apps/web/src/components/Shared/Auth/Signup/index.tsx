import type { Dispatch, FC, SetStateAction } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { useState } from 'react';
import { CHAIN } from 'src/constants';
import { useAccount, useChainId } from 'wagmi';

import WalletSelector from '../WalletSelector';

interface SignupProps {
  setHasConnected?: Dispatch<SetStateAction<boolean>>;
}

const Signup: FC<SignupProps> = ({ setHasConnected }) => {
  const [screen, setScreen] = useState<'handle' | 'minting' | 'success'>(
    'handle'
  );

  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      {chain === CHAIN.id ? (
        <div>WIP</div>
      ) : (
        <SwitchNetwork toChainId={CHAIN.id} />
      )}
    </div>
  ) : (
    <WalletSelector setHasConnected={setHasConnected} />
  );
};

export default Signup;
