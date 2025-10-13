import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GpuTaskFilterMachineState {
  // 选中的机器名称列表
  selectedMachineNames: string[];

  // 设置选中的机器名称
  setSelectedMachineNames: (machineNames: string[]) => void;

  // 清除所有机器选择（自动全选所有机器）
  clearMachineSelection: (allMachineNames?: string[]) => void;
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

      clearMachineSelection: (allMachineNames?: string[]) => {
        // 如果有传入所有机器名称，则自动全选所有机器
        // 否则保持为空数组（兼容旧逻辑）
        const newSelectedMachineNames = allMachineNames || [];
        set({
          selectedMachineNames: newSelectedMachineNames,
        });
      },
    }),
    {
      name: 'gpu-task-filter-machine-storage',
      version: 1,
    },
  ),
);
