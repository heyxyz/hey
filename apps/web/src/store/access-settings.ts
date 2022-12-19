import create from 'zustand';

interface AccessSettingsState {
  restricted: boolean;
  setRestricted: (restricted: boolean) => void;
  collectToView: boolean;
  setCollectToView: (collectToView: boolean) => void;
  followToView: boolean;
  setFollowToView: (followToView: boolean) => void;
  hasConditions: () => boolean;
  reset: () => void;
}

export const useAccessSettingsStore = create<AccessSettingsState>((set, get) => ({
  restricted: false,
  setRestricted: (restricted) => set(() => ({ restricted })),
  collectToView: false,
  setCollectToView: (collectToView) => set(() => ({ collectToView })),
  followToView: false,
  setFollowToView: (followToView) => set(() => ({ followToView })),
  hasConditions: () => {
    const { followToView, collectToView } = get();

    return followToView || collectToView;
  },
  reset: () =>
    set(() => ({
      restricted: false,
      collectToView: false,
      followToView: false
    }))
}));
