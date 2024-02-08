import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { useGenerateLensApiRelayAddressQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
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
  profileId: string;
  screen: 'choose' | 'minting' | 'success';
  setChoosedHandle: (handle: string) => void;
  setDelegatedExecutor: (executor: string) => void;
  setProfileId: (id: string) => void;
  setScreen: (screen: 'choose' | 'minting' | 'success') => void;
  setTransactionHash: (hash: string) => void;
  transactionHash: string;
}

export const useSignupStore = create<SignupState>((set) => ({
  choosedHandle: '',
  delegatedExecutor: '',
  profileId: '',
  screen: 'choose',
  setChoosedHandle: (handle) => set({ choosedHandle: handle }),
  setDelegatedExecutor: (executor) => set({ delegatedExecutor: executor }),
  setProfileId: (id) => set({ profileId: id }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ''
}));

const Signup: FC = () => {
  const screen = useSignupStore((state) => state.screen);
  const setDelegatedExecutor = useSignupStore(
    (state) => state.setDelegatedExecutor
  );

  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  const { error, loading } = useGenerateLensApiRelayAddressQuery({
    fetchPolicy: 'no-cache',
    onCompleted: (data) =>
      setDelegatedExecutor(data.generateLensAPIRelayAddress)
  });

  if (loading) {
    return <Loader message="Loading..." />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load relay address" />;
  }

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
