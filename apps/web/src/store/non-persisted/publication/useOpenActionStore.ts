import type { OpenAction } from '@hey/data/enums';
import type { UnknownOpenActionModuleInput } from '@hey/lens';

import { create } from 'zustand';

interface OpenActionState {
  openAction: null | UnknownOpenActionModuleInput;
  reset: () => void;
  selectedOpenAction: null | OpenAction;
  setOpenAction: (openAction: UnknownOpenActionModuleInput) => void;
  setSelectedOpenAction: (selectedOpenAction: OpenAction) => void;
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
}

export const useOpenActionStore = create<OpenActionState>((set) => ({
  openAction: null,
  reset: () => set({ openAction: null, selectedOpenAction: null }),
  selectedOpenAction: null,
  setOpenAction: (openAction) => set({ openAction }),
  setSelectedOpenAction: (selectedOpenAction) => set({ selectedOpenAction }),
  setShowModal: (showModal) => set({ showModal }),
  showModal: false
}));
