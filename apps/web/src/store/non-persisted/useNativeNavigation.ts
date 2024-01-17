import type { AnyPublication } from '@hey/lens';

import { create } from 'zustand';

interface NativeNavigationState {
  preLoadedPublication: AnyPublication | null;
  setPreLoadedPublication: (publication: AnyPublication | null) => void;
}

export const useNativeNavigation = create<NativeNavigationState>((set) => ({
  preLoadedPublication: null,
  setPreLoadedPublication: (publication) =>
    set(() => ({
      preLoadedPublication: publication
    }))
}));
