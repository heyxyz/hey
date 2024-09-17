import type { MetadataLicenseType } from "@lens-protocol/metadata";

import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  license: MetadataLicenseType | null;
  setLicense: (license: MetadataLicenseType | null) => void;
}

const store = create<State>((set) => ({
  license: null,
  setLicense: (license) => set(() => ({ license }))
}));

export const usePublicationLicenseStore = createTrackedSelector(store);
