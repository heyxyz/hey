import type { AnyPublication } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  publicationContent: string;
  quotedPublication: AnyPublication | null;
  setPublicationContent: (publicationContent: string) => void;
  setQuotedPublication: (quotedPublication: AnyPublication | null) => void;
}

const store = create<State>((set) => ({
  publicationContent: '',
  quotedPublication: null,
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  setQuotedPublication: (quotedPublication) =>
    set(() => ({ quotedPublication }))
}));

export const usePublicationStore = createTrackedSelector(store);
