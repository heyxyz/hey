import { create } from 'zustand';

interface PublicationOpenAiState {
  parentContent: null | string;
  setParentContent: (parentContent: null | string) => void;
  setShowOpenAiGenerator: (showOpenAiGenerator: boolean) => void;
  showOpenAiGenerator: boolean;
}

export const usePublicationOpenAiStore = create<PublicationOpenAiState>(
  (set) => ({
    parentContent: null,
    setParentContent: (parentContent) => set(() => ({ parentContent })),
    setShowOpenAiGenerator: (showOpenAiGenerator) =>
      set(() => ({ showOpenAiGenerator })),
    showOpenAiGenerator: false
  })
);
