import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGpuTaskFilterProjectNameStore {
  projectName: string;
  isFuzzyMatch: boolean;

  setProjectName: (projectName: string) => void;
  setIsFuzzyMatch: (isFuzzyMatch: boolean) => void;
  toggleFuzzyMatch: () => void;
  clearProjectFilter: () => void;
}

export const useGpuTaskFilterProjectNameStore =
  create<IGpuTaskFilterProjectNameStore>()(
    persist(
      (set) => ({
        projectName: '',
        isFuzzyMatch: true,

        setProjectName: (projectName) => set({ projectName }),
        setIsFuzzyMatch: (isFuzzyMatch) => set({ isFuzzyMatch }),
        toggleFuzzyMatch: () =>
          set((state) => ({ isFuzzyMatch: !state.isFuzzyMatch })),
        clearProjectFilter: () => set({ projectName: '', isFuzzyMatch: true }),
      }),
      {
        name: 'gpu-task-filter-project-storage',
        version: 1,
      },
    ),
  );
