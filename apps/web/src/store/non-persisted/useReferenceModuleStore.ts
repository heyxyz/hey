import { ReferenceModuleType } from '@hey/lens';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  degreesOfSeparation: number;
  onlyFollowers: boolean;
  selectedReferenceModule: ReferenceModuleType;
  setDegreesOfSeparation: (degreesOfSeparation: number) => void;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
  setSelectedReferenceModule: (selectedModule: ReferenceModuleType) => void;
}

const store = create<State>((set) => ({
  degreesOfSeparation: 2,
  onlyFollowers: false,
  selectedReferenceModule: ReferenceModuleType.FollowerOnlyReferenceModule,
  setDegreesOfSeparation: (degreesOfSeparation) =>
    set(() => ({ degreesOfSeparation })),
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  setSelectedReferenceModule: (selectedReferenceModule) =>
    set(() => ({ selectedReferenceModule }))
}));

export const useReferenceModuleStore = createTrackedSelector(store);
