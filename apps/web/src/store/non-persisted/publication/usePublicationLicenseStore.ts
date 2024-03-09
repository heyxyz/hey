import type { MetadataLicenseType } from '@lens-protocol/metadata';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface PublicationLicenseState {
  license: MetadataLicenseType | null;
  setLicense: (license: MetadataLicenseType | null) => void;
}

const store = create<PublicationLicenseState>((set) => ({
  license: null,
  setLicense: (license) => set(() => ({ license }))
}));

export const usePublicationLicenseStore = createTrackedSelector(store);
