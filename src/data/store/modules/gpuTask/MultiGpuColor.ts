import { create } from 'zustand';

interface IMultiGpuTagColor {
  multiGpuColor: Map<number, string>;

  setPidColor: (pid: number, color: string) => void;
  getPidColor: (pid: number) => string;
  getColorList: () => string[];
}

export const UseMultiGpuTagColorStore = create<IMultiGpuTagColor>()((set) => ({
  multiGpuColor: new Map(),

  setPidColor: (pid: number, color: string) =>
    set((state) => {
      state.multiGpuColor.set(pid, color);
      return state;
    }),
  getPidColor: (pid: number): string => {
    return UseMultiGpuTagColorStore.getState().multiGpuColor.get(pid) ?? '';
  },
  getColorList: (): string[] => {
    const colorList: string[] = [];
    for (const [, value] of UseMultiGpuTagColorStore.getState().multiGpuColor) {
      colorList.push(value);
    }
    return colorList;
  },
}));
