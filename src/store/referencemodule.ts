/* eslint-disable no-unused-vars */
import { DegreesOfSeparationConfig } from '@generated/lenstertypes';
import { ReferenceModules } from '@generated/types';
import create from 'zustand';

interface ReferenceModuleState {
  selectedModule: ReferenceModules;
  setSelectedModule: (selectedModule: ReferenceModules) => void;
  onlyFollowers: boolean;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
  degreesOfSeparationConfig: DegreesOfSeparationConfig;
  setDegreesOfSeparationConfig: (degreesOfSeparationConfig: DegreesOfSeparationConfig) => void;
}

export const useReferenceModuleStore = create<ReferenceModuleState>((set) => ({
  selectedModule: ReferenceModules.FollowerOnlyReferenceModule,
  setSelectedModule: (selectedModule) => set(() => ({ selectedModule })),
  onlyFollowers: false,
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  degreesOfSeparationConfig: {
    commentsRestricted: true,
    mirrorsRestricted: false,
    degreesOfSeparation: 2
  },
  setDegreesOfSeparationConfig: (degreesOfSeparationConfig) => set(() => ({ degreesOfSeparationConfig }))
}));
