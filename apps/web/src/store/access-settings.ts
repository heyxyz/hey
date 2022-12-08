import create from 'zustand';

interface AccessSettingsState {
  restricted: boolean;
  setRestricted: (restricted: boolean) => void;
  collectToView: boolean;
  setCollectToView: (collectToView: boolean) => void;
  reset: () => void;
}

export const useAccessSettingsStore = create<AccessSettingsState>((set) => ({
  restricted: false,
  setRestricted: (restricted) => set(() => ({ restricted })),
  collectToView: false,
  setCollectToView: (collectToView) => set(() => ({ collectToView })),
  reset: () =>
    set(() => ({
      restricted: false,
      collectToView: false,
      followToView: false
    }))
}));
