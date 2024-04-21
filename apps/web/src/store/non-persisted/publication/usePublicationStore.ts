import type { AnyPublication } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  draftId: null | string;
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  setDraftId: (draftId: null | string) => void;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
}

const store = create<State>((set) => ({
  draftId: null,
  publicationContent: '',
  quotedPublication: null,
  setDraftId: (draftId) => set(() => ({ draftId })),
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication }))
}));

export const usePublicationStore = createTrackedSelector(store);
