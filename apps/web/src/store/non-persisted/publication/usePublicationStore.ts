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
  setTags: (tags: null | string[]) => void;
  tags: null | string[];
}

const store = create<State>((set) => ({
  draftId: null,
  publicationContent: '',
  quotedPublication: null,
  setDraftId: (draftId) => set(() => ({ draftId })),
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication })),
  setTags: (tags) => set(() => ({ tags })),
  tags: null
}));

export const usePublicationStore = createTrackedSelector(store);
