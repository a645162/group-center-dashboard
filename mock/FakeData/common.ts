// 获取随机整数
export const getRandomInt = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 获取随机小数
export const getRandomFloat = (
  max: number,
  min: number = 0,
  fixed: number = 2,
): number => {
  let value = Math.random() * (max - min) + min;

  return Number(value.toFixed(fixed));
};

export const getRandomBool = (trueP: number = 50) => {
  return getRandomInt(100, 0) < trueP;
};

export const ceilAndTruncate = (num: number): string => {
  const ceilNum = Math.ceil(num);
  const truncatedNum = Math.trunc(ceilNum);
  return truncatedNum.toString();
};
