import { create } from 'zustand';

interface PreferencesState {
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
  isPride: boolean;
  setIsPride: (isPride: boolean) => void;
  highSignalNotificationFilter: boolean;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
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
  isPride: false,
  setIsPride: (isPride) => set(() => ({ isPride })),
  highSignalNotificationFilter: false,
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter })),
  resetPreferences: () =>
    set(() => ({
      isStaff: false,
      isGardener: false,
      isTrustedMember: false,
      staffMode: false,
      gardenerMode: false,
      isPride: false,
      highSignalNotificationFilter: false
    }))
}));
