import type { AnyPublication } from '@hey/lens';

import { create } from 'zustand';

interface PublicationState {
  liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  };
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  resetLiveVideoConfig: () => void;
  setLiveVideoConfig: (liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  }) => void;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
  setShowLiveVideoEditor: (showLiveVideoEditor: boolean) => void;
  showLiveVideoEditor: boolean;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  isUploading: false,
  liveVideoConfig: { id: '', playbackId: '', streamKey: '' },
  publicationContent: '',
  quotedPublication: null,
  resetLiveVideoConfig: () =>
    set(() => ({ liveVideoConfig: { id: '', playbackId: '', streamKey: '' } })),
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication })),
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  showLiveVideoEditor: false
}));
