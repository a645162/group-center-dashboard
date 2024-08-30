import { random, randomInt } from 'es-toolkit';

export const ensureInt = (num: number): number => {
  // 四舍五入
  return Math.round(num);
};

// 获取随机整数
// export const getRandomInt = (max: number, min: number = 0) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };
export const getRandomInt = (maxValue: number, minValue: number = 0) => {
  let min = ensureInt(minValue);
  let max = ensureInt(maxValue);

  if (min > max) {
    [min, max] = [max, min];
  }

  if (min === max) {
    return min;
  }

  return randomInt(min, max);
};

// 获取随机小数
export const getRandomFloat = (
  maxValue: number,
  minValue: number = 0,
  fixed: number = 2,
): number => {
  let min = minValue;
  let max = maxValue;

  if (min > max) {
    [min, max] = [max, min];
  }

  if (min === max) {
    return min;
  }

  //   let value = Math.random() * (max - min) + min;
  let value = random(min, max);

  return Number(value.toFixed(fixed));
};

export const getRandomBool = (trueP: number = 50) => {
  return getRandomInt(100) < trueP;
};

export const ceilAndTruncate = (num: number): string => {
  const ceilNum = Math.ceil(num);
  const truncatedNum = Math.trunc(ceilNum);
  return truncatedNum.toString();
};
