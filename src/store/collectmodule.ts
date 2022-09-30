/* eslint-disable no-unused-vars */
import { EnabledModule } from '@generated/types';
import { defaultFeeData, defaultModuleData, FEE_DATA_TYPE } from '@lib/getModule';
import create from 'zustand';

interface CollectModuleState {
  selectedCollectModule: EnabledModule;
  setSelectedCollectModule: (selectedModule: EnabledModule) => void;
  feeData: FEE_DATA_TYPE;
  setFeeData: (feeData: FEE_DATA_TYPE) => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  selectedCollectModule: defaultModuleData,
  setSelectedCollectModule: (selectedCollectModule) => set(() => ({ selectedCollectModule })),
  feeData: defaultFeeData,
  setFeeData: (feeData) => set(() => ({ feeData }))
}));
