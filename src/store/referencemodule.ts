/* eslint-disable no-unused-vars */
import { ReferenceModules } from '@generated/types';
import create from 'zustand';

interface ReferenceModuleState {
  selectedModule: ReferenceModules;
  setSelectedModule: (selectedModule: ReferenceModules) => void;
  onlyFollowers: boolean;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
}

export const useReferenceModuleStore = create<ReferenceModuleState>((set) => ({
  selectedModule: ReferenceModules.FollowerOnlyReferenceModule,
  setSelectedModule: (selectedModule) => set(() => ({ selectedModule })),
  onlyFollowers: false,
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers }))
}));
