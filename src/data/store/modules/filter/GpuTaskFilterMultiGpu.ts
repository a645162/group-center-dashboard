import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GpuTaskFilterMultiGpuState {
  multiGpuFilter: 'none' | 'single' | 'multi';
  setMultiGpuFilter: (filter: 'none' | 'single' | 'multi') => void;
  clearMultiGpuFilter: () => void;
}

export const useGpuTaskFilterMultiGpuStore =
  create<GpuTaskFilterMultiGpuState>()(
    persist(
      (set) => ({
        multiGpuFilter: 'none',
        setMultiGpuFilter: (filter) => set({ multiGpuFilter: filter }),
        clearMultiGpuFilter: () => set({ multiGpuFilter: 'none' }),
      }),
      {
        name: 'gpu-task-filter-multi-gpu-storage',
        version: 1,
      },
    ),
  );
