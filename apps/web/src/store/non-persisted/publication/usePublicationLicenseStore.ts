import type { PublicationMetadataLicenseType } from '@hey/lens';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface PublicationLicenseState {
  license: null | PublicationMetadataLicenseType;
  setLicense: (license: null | PublicationMetadataLicenseType) => void;
}

const store = create<PublicationLicenseState>((set) => ({
  license: null,
  setLicense: (license) => set(() => ({ license }))
}));

export const usePublicationLicenseStore = createTrackedSelector(store);
