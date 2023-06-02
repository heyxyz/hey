import { Localstorage } from '@lenster/data';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FingerprintState {
  fingerprint: string | null;
  setFingerprint: (fingerprint: string | null) => void;
}

export const useFingerprintStore = create(
  persist<FingerprintState>(
    (set) => ({
      fingerprint: null,
      setFingerprint: (fingerprint) => set(() => ({ fingerprint }))
    }),
    { name: Localstorage.FingerprintStore }
  )
);
