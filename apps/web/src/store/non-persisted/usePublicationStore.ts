import type { AnyPublication } from '@hey/lens';
import type { NewAttachment } from '@hey/types/misc';
import type { MetadataLicenseType } from '@lens-protocol/metadata';

import { create } from 'zustand';

interface PublicationState {
  addAttachments: (attachments: NewAttachment[]) => void;
  attachments: NewAttachment[];
  audioPublication: {
    artist: string;
    cover: string;
    coverMimeType: string;
    title: string;
  };
  isUploading: boolean;
  license: MetadataLicenseType | null;
  liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  };
  pollConfig: {
    length: number;
    options: string[];
  };
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  removeAttachments: (ids: string[]) => void;
  resetLiveVideoConfig: () => void;
  resetPollConfig: () => void;
  setAttachments: (attachments: NewAttachment[]) => void;
  setAudioPublication: (audioPublication: {
    artist: string;
    cover: string;
    coverMimeType: string;
    title: string;
  }) => void;
  setIsUploading: (isUploading: boolean) => void;
  setLicense: (license: MetadataLicenseType | null) => void;
  setLiveVideoConfig: (liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  }) => void;
  setPollConfig: (pollConfig: { length: number; options: string[] }) => void;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
  setShowLiveVideoEditor: (showLiveVideoEditor: boolean) => void;
  setShowPollEditor: (showPollEditor: boolean) => void;
  setUploadedPercentage: (uploadedPercentage: number) => void;
  setVideoDurationInSeconds: (videoDurationInSeconds: string) => void;
  setVideoThumbnail: (videoThumbnail: {
    type?: string;
    uploading?: boolean;
    url?: string;
  }) => void;
  showLiveVideoEditor: boolean;
  showPollEditor: boolean;
  updateAttachments: (attachments: NewAttachment[]) => void;
  uploadedPercentage: number;
  videoDurationInSeconds: string;
  videoThumbnail: {
    type?: string;
    uploading?: boolean;
    url?: string;
  };
}

export const usePublicationStore = create<PublicationState>((set) => ({
  addAttachments: (newAttachments) =>
    set((state) => {
      return { attachments: [...state.attachments, ...newAttachments] };
    }),
  attachments: [],
  audioPublication: {
    artist: '',
    cover: '',
    coverMimeType: 'image/jpeg',
    title: ''
  },
  isUploading: false,
  license: null,
  liveVideoConfig: { id: '', playbackId: '', streamKey: '' },
  pollConfig: { length: 7, options: ['', ''] },
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
  resetPollConfig: () =>
    set(() => ({ pollConfig: { length: 1, options: ['', ''] } })),
  setAttachments: (attachments) => set(() => ({ attachments })),
  setAudioPublication: (audioPublication) => set(() => ({ audioPublication })),
  setIsUploading: (isUploading) => set(() => ({ isUploading })),
  setLicense: (license) => set(() => ({ license })),
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  setPollConfig: (pollConfig) => set(() => ({ pollConfig })),
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication })),
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  setShowPollEditor: (showPollEditor) => set(() => ({ showPollEditor })),
  setUploadedPercentage: (uploadedPercentage) =>
    set(() => ({ uploadedPercentage })),
  setVideoDurationInSeconds: (videoDurationInSeconds) =>
    set(() => ({ videoDurationInSeconds })),
  setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
  showLiveVideoEditor: false,
  showPollEditor: false,
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
  uploadedPercentage: 0,
  videoDurationInSeconds: '',
  videoThumbnail: { type: '', uploading: false, url: '' }
}));
