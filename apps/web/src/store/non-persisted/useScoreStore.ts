import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  expiresAt: Date;
  score: number;
  setScore: (score: number) => void;
}

const store = create<State>((set) => ({
  expiresAt: new Date(),
  score: 0,
  setScore: (score) => set(() => ({ score }))
}));

export const useScoreStore = createTrackedSelector(store);
