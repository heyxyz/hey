/* eslint-disable no-unused-vars */
import { LensterPublication } from '@generated/lenstertypes';
import create from 'zustand';

interface PublicationState {
  showNewPostModal: boolean;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  parentPub: LensterPublication | null;
  setParentPub: (parentPub: LensterPublication | null) => void;
  publicationContent: string;
  setPublicationContent: (publicationContent: string) => void;
  previewPublication: boolean;
  setPreviewPublication: (previewPublication: boolean) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  parentPub: null,
  setParentPub: (parentPub) => set(() => ({ parentPub })),
  publicationContent: '',
  setPublicationContent: (publicationContent) => set(() => ({ publicationContent })),
  previewPublication: false,
  setPreviewPublication: (previewPublication) => set(() => ({ previewPublication }))
}));
