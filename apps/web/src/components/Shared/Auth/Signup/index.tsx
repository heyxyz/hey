import type { FC } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { CHAIN } from 'src/constants';
import { useAccount, useChainId } from 'wagmi';
import { create } from 'zustand';

import WalletSelector from '../WalletSelector';
import ChooseHandle from './ChooseHandle';

interface SignupState {
  screen: 'handle' | 'minting' | 'success';
  setScreen: (screen: 'handle' | 'minting' | 'success') => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  screen: 'handle',
  setScreen: (screen) => set({ screen })
}));

const Signup: FC = () => {
  const screen = useSignupStore((state) => state.screen);

  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      {chain === CHAIN.id ? (
        screen === 'handle' ? (
          <ChooseHandle />
        ) : screen === 'minting' ? (
          <div>TBD</div>
        ) : (
          <div>TBD</div>
        )
      ) : (
        <SwitchNetwork toChainId={CHAIN.id} />
      )}
    </div>
  ) : (
    <WalletSelector />
  );
};

export default Signup;
