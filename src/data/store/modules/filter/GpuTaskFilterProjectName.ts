import { create } from 'zustand';

interface IGpuTaskFilterProjectNameStore {
  projectName: string;
  isFuzzyMatch: boolean;

  setProjectName: (userNameEng: string) => void;
  setIsFuzzyMatch: (isFuzzyMatch: boolean) => void;
  toggleFuzzyMatch: () => void;
}

export const useGpuTaskFilterProjectNameStore =
  create<IGpuTaskFilterProjectNameStore>()((set) => ({
    projectName: '',
    isFuzzyMatch: true,

    setProjectName: (userNameEng) => set({ projectName: userNameEng }),
    setIsFuzzyMatch: (isFuzzyMatch) => set({ isFuzzyMatch }),
    toggleFuzzyMatch: () =>
      set((state) => ({ isFuzzyMatch: !state.isFuzzyMatch })),
  }));
