import { ReferenceModules } from '@generated/types';
import create from 'zustand';

interface ReferenceModuleState {
  selectedReferenceModule: ReferenceModules;
  setSelectedReferenceModule: (selectedModule: ReferenceModules) => void;
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
  selectedReferenceModule: ReferenceModules.FollowerOnlyReferenceModule,
  setSelectedReferenceModule: (selectedReferenceModule) => set(() => ({ selectedReferenceModule })),
  onlyFollowers: false,
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  commentsRestricted: true,
  setCommentsRestricted: (commentsRestricted) => set(() => ({ commentsRestricted })),
  mirrorsRestricted: false,
  setMirrorsRestricted: (mirrorsRestricted) => set(() => ({ mirrorsRestricted })),
  degreesOfSeparation: 2,
  setDegreesOfSeparation: (degreesOfSeparation) => set(() => ({ degreesOfSeparation }))
}));
