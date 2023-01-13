import { create } from 'zustand';

interface AuthState {
  showAuthModal: boolean;
  setShowAuthModal: (showAuthModal: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  showAuthModal: false,
  setShowAuthModal: (showAuthModal) => set(() => ({ showAuthModal }))
}));
