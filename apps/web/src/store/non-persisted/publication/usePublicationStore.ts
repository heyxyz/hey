import type { AnyPublication } from '@hey/lens';
import type { NewAttachment } from '@hey/types/misc';
import type { MetadataLicenseType } from '@lens-protocol/metadata';

import { create } from 'zustand';

interface PublicationState {
  addAttachments: (attachments: NewAttachment[]) => void;
  attachments: NewAttachment[];
  isUploading: boolean;
  license: MetadataLicenseType | null;
  liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  };
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  removeAttachments: (ids: string[]) => void;
  resetLiveVideoConfig: () => void;
  setAttachments: (attachments: NewAttachment[]) => void;
  setIsUploading: (isUploading: boolean) => void;
  setLicense: (license: MetadataLicenseType | null) => void;
  setLiveVideoConfig: (liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  }) => void;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
  setShowLiveVideoEditor: (showLiveVideoEditor: boolean) => void;
  showLiveVideoEditor: boolean;
  updateAttachments: (attachments: NewAttachment[]) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  addAttachments: (newAttachments) =>
    set((state) => {
      return { attachments: [...state.attachments, ...newAttachments] };
    }),
  attachments: [],
  isUploading: false,
  license: null,
  liveVideoConfig: { id: '', playbackId: '', streamKey: '' },
  publicationContent: '',
  quotedPublication: null,
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
  resetLiveVideoConfig: () =>
    set(() => ({ liveVideoConfig: { id: '', playbackId: '', streamKey: '' } })),
  setAttachments: (attachments) => set(() => ({ attachments })),
  setIsUploading: (isUploading) => set(() => ({ isUploading })),
  setLicense: (license) => set(() => ({ license })),
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication })),
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  showLiveVideoEditor: false,
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
    })
}));
