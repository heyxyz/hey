import type { OpenAction } from '@hey/data/enums';
import type { UnknownOpenActionModuleInput } from '@hey/lens';

import { create } from 'zustand';

export enum ScreenType {
  Config = 'CONFIG',
  List = 'LIST'
}

interface OpenActionState {
  openAction: null | UnknownOpenActionModuleInput;
  reset: () => void;
  screen: ScreenType;
  selectedOpenAction: null | OpenAction;
  setOpenAction: (openAction: UnknownOpenActionModuleInput) => void;
  setScreen: (screen: ScreenType) => void;
  setSelectedOpenAction: (selectedOpenAction: OpenAction) => void;
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
}

export const useOpenActionStore = create<OpenActionState>((set) => ({
  openAction: null,
  reset: () =>
    set({
      openAction: null,
      screen: ScreenType.List,
      selectedOpenAction: null
    }),
  screen: ScreenType.List,
  selectedOpenAction: null,
  setOpenAction: (openAction) => set({ openAction }),
  setScreen: (screen) => set({ screen }),
  setSelectedOpenAction: (selectedOpenAction) => set({ selectedOpenAction }),
  setShowModal: (showModal) => set({ showModal }),
  showModal: false
}));
