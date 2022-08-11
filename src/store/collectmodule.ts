/* eslint-disable no-unused-vars */
import { defaultFeeData, FEE_DATA_TYPE } from '@lib/getModule';
import create from 'zustand';

interface CollectModuleState {
  feeData: FEE_DATA_TYPE;
  setFeeData: (showNewPostModal: FEE_DATA_TYPE) => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  feeData: defaultFeeData,
  setFeeData: (feeData) => set(() => ({ feeData }))
}));
