import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  isPro: boolean;
  proExpiresAt: Date | null;
  setIsPro: (isPro: boolean) => void;
  setProExpiresAt: (proExpiresAt: Date | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const store = create<State>((set) => ({
  isPro: false,
  proExpiresAt: null,
  setIsPro: (isPro) => set(() => ({ isPro })),
  setProExpiresAt: (proExpiresAt) => set(() => ({ proExpiresAt })),
  loading: false,
  setLoading: (loading) => set(() => ({ loading }))
}));

export const useProStore = createTrackedSelector(store);
