import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface NonceState {
  lensHubOnchainSigNonce: number;
  setLensHubOnchainSigNonce: (nonce: number) => void;
}

export const useNonceStore = create(
  subscribeWithSelector<NonceState>((set) => ({
    lensHubOnchainSigNonce: 0,
    setLensHubOnchainSigNonce: (nonce: number) =>
      set(() => ({ lensHubOnchainSigNonce: nonce }))
  }))
);
