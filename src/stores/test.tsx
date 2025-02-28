import { create } from "zustand";

enum Sets {
  Hiragana = "Hiragana",
  Katakana = "Katakana",
}

interface TestState {
  currentSet: Sets;
  selectedGroups: string[];
  randomize: boolean;
  setSet: (set: Sets) => void;
  setSelectedGroups: (groups: string[]) => void;
  setRandomize: (randomize: boolean) => void;
}

const useTestStore = create<TestState>()((set) => ({
  currentSet: Sets.Hiragana,
  selectedGroups: [],
  randomize: false,
  setSet: (s) => set({ currentSet: s }),
  setSelectedGroups: (g) => set({ selectedGroups: g }),
  setRandomize: (r) => set({ randomize: r }),
}));

export { useTestStore, Sets };
