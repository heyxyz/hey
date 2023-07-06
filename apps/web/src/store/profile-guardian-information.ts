import { create } from 'zustand';

interface ProfileGuardianInformationState {
  profileGuardianInformation: {
    isProtected: boolean;
    disablingProtectionTimestamp: number | null | undefined;
  };
  setProfileGuardianInformation: ({
    isProtected,
    disablingProtectionTimestamp
  }: {
    isProtected: boolean;
    disablingProtectionTimestamp: number | null | undefined;
  }) => void;
  resetProfileGuardianInformation: () => void;
}

export const useProfileGuardianInformationStore =
  create<ProfileGuardianInformationState>((set) => ({
    profileGuardianInformation: {
      isProtected: true,
      disablingProtectionTimestamp: null
    },
    setProfileGuardianInformation: ({
      isProtected,
      disablingProtectionTimestamp
    }) =>
      set(() => ({
        profileGuardianInformation: {
          isProtected,
          disablingProtectionTimestamp
        }
      })),
    resetProfileGuardianInformation: () =>
      set(() => ({
        profileGuardianInformation: {
          isProtected: true,
          disablingProtectionTimestamp: null
        }
      }))
  }));
