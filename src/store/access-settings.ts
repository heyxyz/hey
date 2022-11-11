import create from 'zustand';

interface AccessSettingsState {
  restricted: boolean;
  setRestricted: (restricted: boolean) => void;
  reset: () => void;
}

export const useAccessSettingsStore = create<AccessSettingsState>((set) => ({
  restricted: false,
  setRestricted: (restricted) => set(() => ({ restricted })),
  reset: () =>
    set(() => ({
      restricted: false
    }))
}));
