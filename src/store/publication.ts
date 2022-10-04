/* eslint-disable no-unused-vars */
import create from 'zustand';

interface PublicationState {
  publicationContent: string;
  setPublicationContent: (publicationContent: string) => void;
  previewPublication: boolean;
  setPreviewPublication: (previewPublication: boolean) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  publicationContent: '',
  setPublicationContent: (publicationContent) => set(() => ({ publicationContent })),
  previewPublication: false,
  setPreviewPublication: (previewPublication) => set(() => ({ previewPublication }))
}));
