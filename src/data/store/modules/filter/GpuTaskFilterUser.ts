import { create } from 'zustand';

interface IGpuTaskFilterUserStore {
  userNameEng: string;
  isFuzzyMatch: boolean;

  setUserNameEng: (userNameEng: string) => void;
  setIsFuzzyMatch: (isFuzzyMatch: boolean) => void;
  toggleFuzzyMatch: () => void;
}

export const useGpuTaskFilterUserStore = create<IGpuTaskFilterUserStore>()(
  (set) => ({
    userNameEng: '',
    isFuzzyMatch: true,

    setUserNameEng: (userNameEng) => set({ userNameEng }),
    setIsFuzzyMatch: (isFuzzyMatch) => set({ isFuzzyMatch }),
    toggleFuzzyMatch: () =>
      set((state) => ({ isFuzzyMatch: !state.isFuzzyMatch })),
  }),
);
