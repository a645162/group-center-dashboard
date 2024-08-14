import { create } from 'zustand';
import { DarkMode } from './DarkMode';

interface IDarkModeState {
  darkMode: DarkMode;
  setDarkMode: (mode: DarkMode) => void;
  toggleDarkMode: () => void;
}

export const useDarkModeStore = create<IDarkModeState>()((set) => ({
  darkMode: DarkMode.Auto, // 默认值为 Auto

  setDarkMode: (mode: DarkMode) => set({ darkMode: mode }),
  toggleDarkMode: () => {
    const currentMode = useDarkModeStore.getState().darkMode;
    const nextMode =
      currentMode === DarkMode.Auto
        ? DarkMode.Dark
        : currentMode === DarkMode.Dark
          ? DarkMode.Light
          : DarkMode.Dark;
    useDarkModeStore.getState().setDarkMode(nextMode);
  },
}));
