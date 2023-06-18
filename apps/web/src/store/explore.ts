import { create } from 'zustand';

interface ExploreState {
  selectedTag: string;
  setSelectedTag: (selectedTag: string) => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  selectedTag: '',
  setSelectedTag: (selectedTag) => set(() => ({ selectedTag }))
}));
