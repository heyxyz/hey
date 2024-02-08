import type { FC } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { CHAIN } from 'src/constants';
import { useAccount, useChainId } from 'wagmi';
import { create } from 'zustand';

import WalletSelector from '../WalletSelector';
import ChooseHandle from './ChooseHandle';
import Minting from './Minting';
import Success from './Success';

interface SignupState {
  delegatedExecutor: string;
  screen: 'choose' | 'minting' | 'success';
  setDelegatedExecutor: (executor: string) => void;
  setScreen: (screen: 'choose' | 'minting' | 'success') => void;
  setTransactionHash: (hash: string) => void;
  transactionHash: string;
}

export const useSignupStore = create<SignupState>((set) => ({
  delegatedExecutor: '',
  screen: 'choose',
  setDelegatedExecutor: (executor) => set({ delegatedExecutor: executor }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ''
}));

const Signup: FC = () => {
  const screen = useSignupStore((state) => state.screen);

  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      {chain === CHAIN.id ? (
        screen === 'choose' ? (
          <ChooseHandle />
        ) : screen === 'minting' ? (
          <Minting />
        ) : (
          <Success />
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
