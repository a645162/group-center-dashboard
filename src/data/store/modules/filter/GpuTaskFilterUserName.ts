import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGpuTaskFilterUserNameStore {
  userNameEng: string;
  isFuzzyMatch: boolean;

  setUserNameEng: (userNameEng: string) => void;
  setIsFuzzyMatch: (isFuzzyMatch: boolean) => void;
  toggleFuzzyMatch: () => void;
  clearUserFilter: () => void;
}

export const useGpuTaskFilterUserNameStore =
  create<IGpuTaskFilterUserNameStore>()(
    persist(
      (set) => ({
        userNameEng: '',
        isFuzzyMatch: true,

        setUserNameEng: (userNameEng) => set({ userNameEng }),
        setIsFuzzyMatch: (isFuzzyMatch) => set({ isFuzzyMatch }),
        toggleFuzzyMatch: () =>
          set((state) => ({ isFuzzyMatch: !state.isFuzzyMatch })),
        clearUserFilter: () => set({ userNameEng: '', isFuzzyMatch: true }),
      }),
      {
        name: 'gpu-task-filter-user-storage',
        version: 1,
      },
    ),
  );
