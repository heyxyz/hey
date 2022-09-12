/* eslint-disable no-unused-vars */
import { EnabledModule } from '@generated/types';
import { defaultFeeData, defaultModuleData, FEE_DATA_TYPE } from '@lib/getModule';
import create from 'zustand';

interface CollectModuleState {
  selectedModule: EnabledModule;
  setSelectedModule: (selectedModule: EnabledModule) => void;
  feeData: FEE_DATA_TYPE;
  setFeeData: (feeData: FEE_DATA_TYPE) => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  selectedModule: defaultModuleData,
  setSelectedModule: (selectedModule) => set(() => ({ selectedModule })),
  feeData: defaultFeeData,
  setFeeData: (feeData) => set(() => ({ feeData }))
}));
