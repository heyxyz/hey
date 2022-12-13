import type { NewLensterAttachment } from '@generated/types';
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
  attachments: NewLensterAttachment[];
  setAttachments: (attachments: NewLensterAttachment[]) => void;
  addAttachments: (attachments: NewLensterAttachment[]) => void;
  updateAttachments: (attachments: NewLensterAttachment[]) => void;
  removeAttachments: (ids: string[]) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
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
      return { attachments: [...state.attachments, ...newAttachments] };
    }),
  updateAttachments: (updateAttachments) =>
    set((state) => {
      const attachments = [...state.attachments];
      updateAttachments.map((attachment) => {
        const index = attachments.findIndex((a) => a.id === attachment.id);
        if (index !== -1) {
          attachments[index] = attachment;
        }
      });
      return { attachments };
    }),
  removeAttachments: (ids) =>
    set((state) => {
      const attachments = [...state.attachments];
      ids.map((id) => {
        const index = attachments.findIndex((a) => a.id === id);
        if (index !== -1) {
          attachments.splice(index, 1);
        }
      });
      return { attachments };
    }),
  isUploading: false,
  setIsUploading: (isUploading) => set(() => ({ isUploading }))
}));
