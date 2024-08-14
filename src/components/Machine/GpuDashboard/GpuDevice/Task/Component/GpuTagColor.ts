import { UseMultiGpuTagColorStore } from '@/data/store/modules/gpuTask/MultiGpuColor';
import {
  blue,
  cyan,
  geekblue,
  gold,
  green,
  magenta,
  purple,
  volcano,
} from '@ant-design/colors';

const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length);
};

const getColorFromArray = (color: string[], m: number, n: number) => {
  return color.slice(m, n);
};

const colorStartIndex = 6;
const colorEndIndex = 10;

const colorList = [
  ...getColorFromArray(gold, colorStartIndex, colorEndIndex),
  ...getColorFromArray(volcano, colorStartIndex, colorEndIndex),
  ...getColorFromArray(blue, colorStartIndex, colorEndIndex),
  ...getColorFromArray(green, colorStartIndex, colorEndIndex),
  ...getColorFromArray(cyan, colorStartIndex, colorEndIndex),
  ...getColorFromArray(geekblue, colorStartIndex, colorEndIndex),
  ...getColorFromArray(purple, colorStartIndex, colorEndIndex),
  ...getColorFromArray(magenta, colorStartIndex, colorEndIndex),
];

const colorSelectNewColor = (alreadyExistColors: string[]) => {
  // 从colorList中随机选择一个颜色，并且不在alreadyExistColors中，如果存在就要重新选择

  let currentColorList = colorList.filter(
    (color) => !alreadyExistColors.includes(color),
  );

  if (currentColorList.length === 0) {
    currentColorList = colorList;
  }

  const colorIndex = getRandomIndex(currentColorList.length);

  return colorList[colorIndex];
};

export const getTopPythonPidColor = (topPythonPid: number): string => {
  const getPidColor = UseMultiGpuTagColorStore((state) => state.getPidColor);
  const setPidColor = UseMultiGpuTagColorStore((state) => state.setPidColor);
  const getColorList = UseMultiGpuTagColorStore((state) => state.getColorList);

  let color = getPidColor(topPythonPid);
  if (color === '') {
    color = colorSelectNewColor(getColorList());
    setPidColor(topPythonPid, color);
  }

  return color;
};
