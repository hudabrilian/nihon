import { create } from "zustand";

enum Font {
  NotoSansJP = "font-noto-sans-jp",
  NotoSerifJP = "font-noto-serif-jp",
}

const fonts = [
  {
    name: "Noto Sans JP",
    value: Font.NotoSansJP,
  },
  {
    name: "Noto Serif JP",
    value: Font.NotoSerifJP,
  },
];

enum Theme {
  Light = "light",
  Dark = "dark",
  Synthwave = "synthwave",
  Cyberpunk = "cyberpunk",
  Cupcake = "cupcake",
}

const themes = [
  {
    name: "Light",
    value: Theme.Light,
  },
  {
    name: "Dark",
    value: Theme.Dark,
  },
  {
    name: "Synthwave",
    value: Theme.Synthwave,
  },
  {
    name: "Cyberpunk",
    value: Theme.Cyberpunk,
  },
  {
    name: "Cupcake",
    value: Theme.Cupcake,
  },
];

interface SettingsState {
  font: (typeof Font)[keyof typeof Font];
  theme: (typeof Theme)[keyof typeof Theme];
  showPreviousQuestion: boolean;
  showNextQuestion: boolean;
  enableSound: boolean;

  setFont: (font: (typeof Font)[keyof typeof Font]) => void;
  setTheme: (theme: (typeof Theme)[keyof typeof Theme]) => void;
  setShowPreviousQuestion: (showPreviousQuestion: boolean) => void;
  setShowNextQuestion: (showNextQuestion: boolean) => void;
  setEnableSound: (enableSound: boolean) => void;
}

const useSettingsStore = create<SettingsState>()((set) => ({
  font: Font.NotoSansJP,
  theme: Theme.Synthwave,
  showPreviousQuestion: true,
  showNextQuestion: true,
  enableSound: true,
  setFont: (font) => set({ font }),
  setTheme: (theme) => set({ theme }),
  setShowPreviousQuestion: (showPreviousQuestion) =>
    set({ showPreviousQuestion }),
  setShowNextQuestion: (showNextQuestion) => set({ showNextQuestion }),
  setEnableSound: (enableSound) => set({ enableSound }),
}));

export { Font, fonts, Theme, themes, useSettingsStore };
