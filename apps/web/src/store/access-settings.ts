import create from 'zustand';

interface AccessSettingsState {
  restricted: boolean;
  setRestricted: (restricted: boolean) => void;
  followToView: boolean;
  setFollowToView: (followToView: boolean) => void;
  hasConditions: () => boolean;
  reset: () => void;
}

export const useAccessSettingsStore = create<AccessSettingsState>((set, get) => ({
  restricted: false,
  setRestricted: (restricted) => set(() => ({ restricted })),
  followToView: false,
  setFollowToView: (followToView) => set(() => ({ followToView })),
  hasConditions: () => {
    const { followToView } = get();

    return followToView;
  },
  reset: () =>
    set(() => ({
      restricted: false,
      followToView: false
    }))
}));
