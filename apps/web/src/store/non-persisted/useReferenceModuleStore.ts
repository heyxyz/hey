import { ReferenceModuleType } from '@hey/lens';
import { create } from 'zustand';

interface ReferenceModuleState {
  degreesOfSeparation: number;
  onlyFollowers: boolean;
  selectedReferenceModule: ReferenceModuleType;
  setDegreesOfSeparation: (degreesOfSeparation: number) => void;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
  setSelectedReferenceModule: (selectedModule: ReferenceModuleType) => void;
}

export const useReferenceModuleStore = create<ReferenceModuleState>((set) => ({
  degreesOfSeparation: 2,
  onlyFollowers: false,
  selectedReferenceModule: ReferenceModuleType.FollowerOnlyReferenceModule,
  setDegreesOfSeparation: (degreesOfSeparation) =>
    set(() => ({ degreesOfSeparation })),
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  setSelectedReferenceModule: (selectedReferenceModule) =>
    set(() => ({ selectedReferenceModule }))
}));
