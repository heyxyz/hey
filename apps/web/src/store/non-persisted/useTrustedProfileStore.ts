import { create } from 'zustand';

interface TrustedProfileState {
  isTrusted: boolean;
  resetTrusted: () => void;
  setIstrusted: (isTrusted: boolean) => void;
}

export const useTrustedProfileStore = create<TrustedProfileState>((set) => ({
  isTrusted: false,
  resetTrusted: () =>
    set(() => ({
      isTrusted: false
    })),
  setIstrusted: (isTrusted) => set(() => ({ isTrusted }))
}));
