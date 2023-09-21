import { ReferenceModuleType } from '@lenster/lens';
import { create } from 'zustand';

interface ReferenceModuleState {
  selectedReferenceModule: ReferenceModuleType;
  setSelectedReferenceModule: (selectedModule: ReferenceModuleType) => void;
  onlyFollowers: boolean;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
  degreesOfSeparation: number;
  setDegreesOfSeparation: (degreesOfSeparation: number) => void;
}

export const useReferenceModuleStore = create<ReferenceModuleState>((set) => ({
  selectedReferenceModule: ReferenceModuleType.FollowerOnlyReferenceModule,
  setSelectedReferenceModule: (selectedReferenceModule) =>
    set(() => ({ selectedReferenceModule })),
  onlyFollowers: false,
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  degreesOfSeparation: 2,
  setDegreesOfSeparation: (degreesOfSeparation) =>
    set(() => ({ degreesOfSeparation }))
}));
