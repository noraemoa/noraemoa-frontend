import { create } from "zustand";
import type { BalanceAnswer } from "../../../types/profile";

interface AnswerStore {
  answers: (BalanceAnswer | null)[];

  setAnswer: (index: number, answer: BalanceAnswer) => void;
  resetAnswer: () => void;
}

export const useAnswerStore = create<AnswerStore>((set) => ({
  answers: Array(8).fill(null),
  setAnswer: (index, answer) =>
    set((state) => {
      const next = [...state.answers];
      next[index] = answer;
      return { answers: next };
    }),
  resetAnswer: () => set({ answers: Array(8).fill(null) }),
}));
