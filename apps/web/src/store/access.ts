import { create } from 'zustand';

interface AccessState {
  isStaff: boolean;
  setIsStaff: (isStaff: boolean) => void;
}

export const useAccessStore = create<AccessState>((set) => ({
  isStaff: false,
  setIsStaff: (isStaff) => set(() => ({ isStaff }))
}));
