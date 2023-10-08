import { create } from 'zustand';

type ProfileGuardianInformationType =
  | { isProtected: true; disablingProtectionTimestamp: null }
  | { isProtected: false; disablingProtectionTimestamp: string };

interface ProfileGuardianInformationState {
  profileGuardianInformation: ProfileGuardianInformationType;
  setProfileGuardianInformation: (
    profileGuardianInformation: ProfileGuardianInformationType
  ) => void;
  resetProfileGuardianInformation: () => void;
}

export const useProfileGuardianInformationStore =
  create<ProfileGuardianInformationState>((set) => ({
    profileGuardianInformation: {
      isProtected: true,
      disablingProtectionTimestamp: null
    },
    setProfileGuardianInformation: (
      profileGuardianInformation: ProfileGuardianInformationType
    ) =>
      set(() => ({
        profileGuardianInformation
      })),
    resetProfileGuardianInformation: () =>
      set(() => ({
        profileGuardianInformation: {
          isProtected: true,
          disablingProtectionTimestamp: null
        }
      }))
  }));
