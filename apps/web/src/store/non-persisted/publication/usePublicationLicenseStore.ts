import type { MetadataLicenseType } from '@lens-protocol/metadata';

import { create } from 'zustand';

interface PublicationLicenseState {
  license: MetadataLicenseType | null;
  setLicense: (license: MetadataLicenseType | null) => void;
}

export const usePublicationLicenseStore = create<PublicationLicenseState>(
  (set) => ({
    license: null,
    setLicense: (license) => set(() => ({ license }))
  })
);
