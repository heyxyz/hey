import type { NewLensterAttachment } from 'src/types';
import { create } from 'zustand';

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
  videoThumbnail: {
    url?: string;
    type?: string;
    uploading?: boolean;
  };
  setVideoThumbnail: (videoThumbnail: { url?: string; type?: string; uploading?: boolean }) => void;
  videoDurationInSeconds: string;
  setVideoDurationInSeconds: (videoDurationInSeconds: string) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  showPollEditor: boolean;
  setShowPollEditor: (showPollEditor: boolean) => void;
  pollConfig: {
    length: number;
    choices: string[];
  };
  setPollConfig: (pollConfig: { length: number; choices: string[] }) => void;
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
  videoThumbnail: { url: '', type: '', uploading: false },
  setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
  videoDurationInSeconds: '',
  setVideoDurationInSeconds: (videoDurationInSeconds) => set(() => ({ videoDurationInSeconds })),
  isUploading: false,
  setIsUploading: (isUploading) => set(() => ({ isUploading })),
  showPollEditor: false,
  setShowPollEditor: (showPollEditor) => set(() => ({ showPollEditor })),
  pollConfig: { length: 7, choices: ['', ''] },
  setPollConfig: (pollConfig) => set(() => ({ pollConfig }))
}));
