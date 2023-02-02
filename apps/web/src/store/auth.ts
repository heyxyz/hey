import { create } from 'zustand';

interface AuthState {
  showSignupModal: boolean;
  setShowSignupModal: (showSignupModal: boolean) => void;
  loginRequested: boolean;
  setLoginRequested: (loginRequested: boolean) => void;
  signingInProgress: boolean;
  setSigningInProgress: (signingInProgress: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  showSignupModal: false,
  setShowSignupModal: (showSignupModal) => set(() => ({ showSignupModal: showSignupModal })),
  loginRequested: false,
  setLoginRequested: (loginRequested) => set(() => ({ loginRequested: loginRequested })),
  signingInProgress: false,
  setSigningInProgress: (signingInProgress) => set(() => ({ signingInProgress: signingInProgress }))
}));
