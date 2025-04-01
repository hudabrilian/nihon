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

export type PreviousAnswers = {
  question: string;
  answers: string[];
};

interface ResultState {
  questions: Array<Result>;
  answers: string[];
  mistakes: Mistake[];
  previousAnswers: PreviousAnswers[];

  setQuestions: (questions: Result[]) => void;
  setAnswers: (answers: string[]) => void;
  setMistakes: (mistakes: Mistake[]) => void;
  setPreviousAnswers: (previousAnswers: PreviousAnswers[]) => void;
}

const useResultStore = create<ResultState>()((set) => ({
  questions: [],
  answers: [],
  mistakes: [],
  previousAnswers: [],

  setQuestions: (questions) => set({ questions }),
  setAnswers: (answers) => set({ answers }),
  setMistakes: (mistakes) => set({ mistakes }),
  setPreviousAnswers: (previousAnswers) => set({ previousAnswers }),
}));

export { useResultStore };
