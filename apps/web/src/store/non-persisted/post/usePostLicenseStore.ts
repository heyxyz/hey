import type { MetadataLicenseType } from "@hey/indexer";
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

export const usePostLicenseStore = createTrackedSelector(store);
