import SwitchNetwork from "@components/Shared/SwitchNetwork";
import type { FC } from "react";
import { createTrackedSelector } from "react-tracked";
import { CHAIN } from "src/constants";
import { useAccount, useChainId } from "wagmi";
import { create } from "zustand";
import WalletSelector from "../WalletSelector";
import ChooseHandle from "./ChooseHandle";
import Minting from "./Minting";
import Success from "./Success";

interface SignupState {
  choosedHandle: string;
  accountAddress: string;
  screen: "choose" | "minting" | "success";
  setChoosedHandle: (handle: string) => void;
  setAccountAddress: (accountAddress: string) => void;
  setScreen: (screen: "choose" | "minting" | "success") => void;
  setTransactionHash: (hash: string) => void;
  transactionHash: string;
}

const store = create<SignupState>((set) => ({
  choosedHandle: "",
  accountAddress: "",
  screen: "choose",
  setChoosedHandle: (handle) => set({ choosedHandle: handle }),
  setAccountAddress: (accountAddress) => set({ accountAddress }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ""
}));

export const useSignupStore = createTrackedSelector(store);

const Signup: FC = () => {
  const { screen } = useSignupStore();
  const chain = useChainId();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      {chain === CHAIN.id ? (
        screen === "choose" ? (
          <ChooseHandle />
        ) : screen === "minting" ? (
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
