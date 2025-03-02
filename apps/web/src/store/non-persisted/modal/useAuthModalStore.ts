import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

type AuthModalType = "login" | "signup";

interface State {
  showAuthModal: boolean;
  authModalType: AuthModalType;
  setShowAuthModal: (
    showAuthModal: boolean,
    authModalType?: AuthModalType
  ) => void;
}

const store = create<State>((set) => ({
  showAuthModal: false,
  authModalType: "login",
  setShowAuthModal: (showAuthModal, authModalType) =>
    set(() => ({ showAuthModal, authModalType }))
}));

export const useAuthModalStore = createTrackedSelector(store);
