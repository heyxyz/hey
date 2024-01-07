import type { AnyPublication } from '@hey/lens';

import { create } from 'zustand';

interface PublicationState {
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  publicationContent: '',
  quotedPublication: null,
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication }))
}));
