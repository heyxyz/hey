import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface NonceState {
  lensHubOnchainSigNonce: number;
  lensPublicActProxyOnchainSigNonce: number;
  setLensHubOnchainSigNonce: (nonce: number) => void;
  setLensPublicActProxyOnchainSigNonce: (nonce: number) => void;
}

export const useNonceStore = create(
  subscribeWithSelector<NonceState>((set) => ({
    lensHubOnchainSigNonce: 0,
    lensPublicActProxyOnchainSigNonce: 0,
    setLensHubOnchainSigNonce: (nonce: number) =>
      set(() => ({ lensHubOnchainSigNonce: nonce })),
    setLensPublicActProxyOnchainSigNonce: (nonce: number) =>
      set(() => ({ lensPublicActProxyOnchainSigNonce: nonce }))
  }))
);
