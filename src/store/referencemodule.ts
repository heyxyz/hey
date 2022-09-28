/* eslint-disable no-unused-vars */
import { ReferenceModules } from '@generated/types';
import create from 'zustand';

interface ReferenceModuleState {
  selectedModule: ReferenceModules;
  setSelectedModule: (selectedModule: ReferenceModules) => void;
  onlyFollowers: boolean;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
  commentsRestricted: boolean;
  setCommentsRestricted: (commentsRestricted: boolean) => void;
  mirrorsRestricted: boolean;
  setMirrorsRestricted: (mirrorsRestricted: boolean) => void;
  degreesOfSeparation: number;
  setDegreesOfSeparation: (degreesOfSeparation: number) => void;
}

export const useReferenceModuleStore = create<ReferenceModuleState>((set) => ({
  selectedModule: ReferenceModules.FollowerOnlyReferenceModule,
  setSelectedModule: (selectedModule) => set(() => ({ selectedModule })),
  onlyFollowers: false,
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  commentsRestricted: true,
  setCommentsRestricted: (commentsRestricted) => set(() => ({ commentsRestricted })),
  mirrorsRestricted: false,
  setMirrorsRestricted: (mirrorsRestricted) => set(() => ({ mirrorsRestricted })),
  degreesOfSeparation: 2,
  setDegreesOfSeparation: (degreesOfSeparation) => set(() => ({ degreesOfSeparation }))
}));
