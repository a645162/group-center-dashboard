import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GpuCardFilterState {
  // 按卡号筛选
  gpuIdFilter: {
    enabled: boolean;
    gpuIds: number[]; // 选中的卡号
    range?: { min: number; max: number }; // 卡号范围
  };

  // 按卡名称筛选
  gpuNameFilter: {
    enabled: boolean;
    gpuName: string;
    isFuzzyMatch: boolean;
  };

  // 设置按卡号筛选
  setGpuIdFilter: (
    gpuIds: number[],
    range?: { min: number; max: number },
  ) => void;

  // 启用/禁用按卡号筛选
  setGpuIdFilterEnabled: (enabled: boolean) => void;

  // 设置按卡名称筛选
  setGpuNameFilter: (gpuName: string, isFuzzyMatch: boolean) => void;

  // 启用/禁用按卡名称筛选
  setGpuNameFilterEnabled: (enabled: boolean) => void;

  // 清除所有按卡筛选
  clearAllCardFilters: () => void;
}

export const useGpuTaskFilterCardStore = create<GpuCardFilterState>()(
  persist(
    (set, get) => ({
      gpuIdFilter: {
        enabled: false,
        gpuIds: [],
        range: undefined,
      },

      gpuNameFilter: {
        enabled: false,
        gpuName: '',
        isFuzzyMatch: true,
      },

      setGpuIdFilter: (
        gpuIds: number[],
        range?: { min: number; max: number },
      ) => {
        set({
          gpuIdFilter: {
            ...get().gpuIdFilter,
            gpuIds,
            range,
          },
        });
      },

      setGpuIdFilterEnabled: (enabled: boolean) => {
        set({
          gpuIdFilter: {
            ...get().gpuIdFilter,
            enabled,
          },
        });
      },

      setGpuNameFilter: (gpuName: string, isFuzzyMatch: boolean) => {
        set({
          gpuNameFilter: {
            ...get().gpuNameFilter,
            gpuName,
            isFuzzyMatch,
          },
        });
      },

      setGpuNameFilterEnabled: (enabled: boolean) => {
        set({
          gpuNameFilter: {
            ...get().gpuNameFilter,
            enabled,
          },
        });
      },

      clearAllCardFilters: () => {
        set({
          gpuIdFilter: {
            enabled: false,
            gpuIds: [],
            range: undefined,
          },
          gpuNameFilter: {
            enabled: false,
            gpuName: '',
            isFuzzyMatch: true,
          },
        });
      },
    }),
    {
      name: 'gpu-task-filter-card-storage',
      version: 1,
    },
  ),
);
