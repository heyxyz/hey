import type { UnknownOpenActionModuleInput } from '@hey/lens';

import { create } from 'zustand';

interface OpenActionState {
  openAction: null | UnknownOpenActionModuleInput;
  reset: () => void;
  setOpenAction: (openAction: UnknownOpenActionModuleInput) => void;
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
}

export const useOpenActionStore = create<OpenActionState>((set) => ({
  openAction: null,
  reset: () => set({ openAction: null }),
  setOpenAction: (openAction) => set({ openAction }),
  setShowModal: (showModal) => set({ showModal }),
  showModal: false
}));
