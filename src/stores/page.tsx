import { create } from "zustand";

enum Page {
  Home = "Home",
  Selection = "Selection",
  Customize = "Customize",
  Test = "Test",
  Result = "Result",
}

interface PageState {
  page: Page;
  setPage: (page: Page) => void;
}

const usePageStore = create<PageState>()((set) => ({
  page: Page.Home,
  setPage: (page) => set({ page }),
}));

export { Page, usePageStore };
