import create from 'zustand';

interface ProfileFeedState {
  mediaFeedFilters: Record<string, boolean>;
  setMediaFeedFilters: (feedEventFilters: Record<string, boolean>) => void;
}

export const useProfileFeedStore = create<ProfileFeedState>((set) => ({
  mediaFeedFilters: { images: true, video: true, audio: true },
  setMediaFeedFilters: (mediaFeedFilters) => set(() => ({ mediaFeedFilters }))
}));
