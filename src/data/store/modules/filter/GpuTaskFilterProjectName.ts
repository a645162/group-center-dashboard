import { create } from 'zustand';

interface IGpuTaskFilterProjectNameStore {
  projectName: string;
  isFuzzyMatch: boolean;

  setProjectName: (projectName: string) => void;
  setIsFuzzyMatch: (isFuzzyMatch: boolean) => void;
  toggleFuzzyMatch: () => void;
}

export const useGpuTaskFilterProjectNameStore =
  create<IGpuTaskFilterProjectNameStore>()((set) => ({
    projectName: '',
    isFuzzyMatch: true,

    setProjectName: (projectName) => set({ projectName }),
    setIsFuzzyMatch: (isFuzzyMatch) => set({ isFuzzyMatch }),
    toggleFuzzyMatch: () =>
      set((state) => ({ isFuzzyMatch: !state.isFuzzyMatch })),
  }));
