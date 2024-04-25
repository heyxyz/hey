import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  expiresAt: Date;
  score: number;
  setExpiresAt: (expiresAt: Date) => void;
  setScore: (score: number) => void;
}

const store = create<State>((set) => ({
  expiresAt: new Date(),
  score: 0,
  setExpiresAt: (expiresAt) => set(() => ({ expiresAt })),
  setScore: (score) => set(() => ({ score }))
}));

export const useScoreStore = createTrackedSelector(store);
