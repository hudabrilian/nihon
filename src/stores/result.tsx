import { create } from "zustand";

type Result = {
  idx: number;
  question: string;
  answer: string;
  group: string;
};

export type Mistake = {
  question: string;
  count: number;
};

interface ResultState {
  questions: Array<Result>;
  answers: string[];
  mistakes: Mistake[];

  setQuestions: (questions: Result[]) => void;
  setAnswers: (answers: string[]) => void;
  setMistakes: (mistakes: Mistake[]) => void;
}

const useResultStore = create<ResultState>()((set) => ({
  questions: [],
  answers: [],
  mistakes: [],

  setQuestions: (questions) => set({ questions }),
  setAnswers: (answers) => set({ answers }),
  setMistakes: (mistakes) => set({ mistakes }),
}));

export { useResultStore };
