import { create } from 'zustand';

interface AccessState {
  isStaff: boolean;
  setIsStaff: (isStaff: boolean) => void;
  isGardener: boolean;
  setIsGardener: (isGardener: boolean) => void;
  isTrustedMember: boolean;
  setIsTrustedMember: (isTrustedMember: boolean) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  gardenerMode: boolean;
  setGardenerMode: (gardenerMode: boolean) => void;
  verifiedMembers: string[];
  setVerifiedMembers: (verifiedMembers: string[]) => void;
  resetAccess: () => void;
}

export const useAccessStore = create<AccessState>((set) => ({
  isStaff: false,
  setIsStaff: (isStaff) => set(() => ({ isStaff })),
  isGardener: false,
  setIsGardener: (isGardener) => set(() => ({ isGardener })),
  isTrustedMember: false,
  setIsTrustedMember: (isTrustedMember) => set(() => ({ isTrustedMember })),
  staffMode: false,
  setStaffMode: (staffMode) => set(() => ({ staffMode })),
  gardenerMode: false,
  setGardenerMode: (gardenerMode) => set(() => ({ gardenerMode })),
  verifiedMembers: [],
  setVerifiedMembers: (verifiedMembers) => set(() => ({ verifiedMembers })),
  resetAccess: () =>
    set(() => ({
      isStaff: false,
      isGardener: false,
      isTrustedMember: false,
      staffMode: false,
      gardenerMode: false
    }))
}));

export const verifiedMembers = () => useAccessStore.getState().verifiedMembers;
