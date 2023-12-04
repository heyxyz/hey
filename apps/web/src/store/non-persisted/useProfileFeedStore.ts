import { create } from 'zustand';

interface ProfileFeedState {
  mediaFeedFilters: Record<string, boolean>;
  setMediaFeedFilters: (feedEventFilters: Record<string, boolean>) => void;
}

export const useProfileFeedStore = create<ProfileFeedState>((set) => ({
  mediaFeedFilters: { audio: true, images: true, video: true },
  setMediaFeedFilters: (mediaFeedFilters) => set(() => ({ mediaFeedFilters }))
}));
