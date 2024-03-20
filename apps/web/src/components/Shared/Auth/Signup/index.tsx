import type { FC } from 'react';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { useGenerateLensApiRelayAddressQuery } from '@hey/lens';
import { createTrackedSelector } from 'react-tracked';
import { CHAIN } from 'src/constants';
import { useAccount, useChainId } from 'wagmi';
import { create } from 'zustand';

import WalletSelector from '../WalletSelector';
import ChooseHandle from './ChooseHandle';
import Minting from './Minting';
import Success from './Success';

interface SignupState {
  choosedHandle: string;
  delegatedExecutor: string;
  mintViaCard: boolean;
  profileId: string;
  screen: 'choose' | 'minting' | 'success';
  setChoosedHandle: (handle: string) => void;
  setDelegatedExecutor: (executor: string) => void;
  setMintViaCard: (mintViaCard: boolean) => void;
  setProfileId: (id: string) => void;
  setScreen: (screen: 'choose' | 'minting' | 'success') => void;
  setTransactionHash: (hash: string) => void;
  transactionHash: string;
}

const store = create<SignupState>((set) => ({
  choosedHandle: '',
  delegatedExecutor: '',
  mintViaCard: false,
  profileId: '',
  screen: 'success',
  setChoosedHandle: (handle) => set({ choosedHandle: handle }),
  setDelegatedExecutor: (executor) => set({ delegatedExecutor: executor }),
  setMintViaCard: (mintViaCard) => set({ mintViaCard }),
  setProfileId: (id) => set({ profileId: id }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ''
}));

export const useSignupStore = createTrackedSelector(store);

const Signup: FC = () => {
  const { screen, setDelegatedExecutor } = useSignupStore();
  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  useGenerateLensApiRelayAddressQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (data) =>
      setDelegatedExecutor(data.generateLensAPIRelayAddress)
  });

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
