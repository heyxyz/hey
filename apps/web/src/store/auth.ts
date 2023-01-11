import { create } from 'zustand';

interface AuthState {
  showLoginFlow: boolean;
  setShowLoginFlow: (showLoginFlow: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  showLoginFlow: false,
  setShowLoginFlow: (showLoginFlow) => set(() => ({ showLoginFlow: showLoginFlow }))
}));
