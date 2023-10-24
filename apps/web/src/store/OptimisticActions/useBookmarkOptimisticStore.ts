import { create } from 'zustand';

interface PublicationConfig {
  countBookmarks: number;
  bookmarked: boolean;
}

interface BookmarkOptimisticState {
  bookmarkConfigs: Record<string, PublicationConfig>;
  setBookmarkConfig: (publicationId: string, config: PublicationConfig) => void;
  getBookmarkCountByPublicationId: (publicationId: string) => number;
  hasBookmarkedByMe: (publicationId: string) => boolean;
}

export const useBookmarkOptimisticStore = create<BookmarkOptimisticState>(
  (set, get) => ({
    bookmarkConfigs: {},
    setBookmarkConfig: (publicationId, config) =>
      set((state) => ({
        bookmarkConfigs: {
          ...state.bookmarkConfigs,
          [publicationId]: config
        }
      })),
    getBookmarkCountByPublicationId: (publicationId) => {
      const { bookmarkConfigs } = get();
      return bookmarkConfigs[publicationId]?.countBookmarks || 0;
    },
    hasBookmarkedByMe: (publicationId) => {
      const { bookmarkConfigs } = get();
      return !!bookmarkConfigs[publicationId]?.bookmarked;
    }
  })
);
