import type { LensterAttachment } from '@generated/types';
import create from 'zustand';

interface PublicationState {
  showNewPostModal: boolean;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  publicationContent: string;
  setPublicationContent: (publicationContent: string) => void;
  audioPublication: { title: string; author: string; cover: string; coverMimeType: string };
  setAudioPublication: (audioPublication: {
    title: string;
    author: string;
    cover: string;
    coverMimeType: string;
  }) => void;
  attachments: LensterAttachment[];
  setAttachments: (attachments: LensterAttachment[]) => void;
  addAttachments: (attachments: LensterAttachment[]) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  publicationContent: '',
  setPublicationContent: (publicationContent) => set(() => ({ publicationContent })),
  audioPublication: { title: '', author: '', cover: '', coverMimeType: 'image/jpeg' },
  setAudioPublication: (audioPublication) => set(() => ({ audioPublication })),
  attachments: [],
  setAttachments: (attachments) => set(() => ({ attachments })),
  addAttachments: (newAttachments) =>
    set((state) => {
      if (newAttachments.length === 0) {
        return { attachments: [...state.attachments] };
      }
      return { attachments: [...state.attachments, ...newAttachments] };
    })
}));
