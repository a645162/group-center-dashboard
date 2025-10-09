import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GpuTaskFilterMachineState {
  // 选中的机器名称列表
  selectedMachineNames: string[];

  // 设置选中的机器名称
  setSelectedMachineNames: (machineNames: string[]) => void;

  // 清除所有机器选择
  clearMachineSelection: () => void;
}

export const useGpuTaskFilterMachineStore = create<GpuTaskFilterMachineState>()(
  persist(
    (set) => ({
      selectedMachineNames: [],

      setSelectedMachineNames: (machineNames: string[]) => {
        set({
          selectedMachineNames: machineNames,
        });
      },

      clearMachineSelection: () => {
        set({
          selectedMachineNames: [],
        });
      },
    }),
    {
      name: 'gpu-task-filter-machine-storage',
      version: 1,
    },
  ),
);
