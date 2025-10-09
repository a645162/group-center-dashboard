import { create } from 'zustand';

interface GpuTaskFilterMultiGpuState {
  multiGpuFilter: 'none' | 'single' | 'multi';
  setMultiGpuFilter: (filter: 'none' | 'single' | 'multi') => void;
}

export const useGpuTaskFilterMultiGpuStore = create<GpuTaskFilterMultiGpuState>(
  (set) => ({
    multiGpuFilter: 'none',
    setMultiGpuFilter: (filter) => set({ multiGpuFilter: filter }),
  }),
);
