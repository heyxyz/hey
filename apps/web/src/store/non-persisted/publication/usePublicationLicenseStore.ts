import type { PublicationMetadataLicenseType } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  license: null | PublicationMetadataLicenseType;
  setLicense: (license: null | PublicationMetadataLicenseType) => void;
}

const store = create<State>((set) => ({
  license: null,
  setLicense: (license) => set(() => ({ license }))
}));

export const usePublicationLicenseStore = createTrackedSelector(store);
