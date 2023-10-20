import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface NonceState {
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
}

export const useNonceStore = create(
  subscribeWithSelector<NonceState>((set) => ({
    userSigNonce: 0,
    setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce }))
  }))
);
