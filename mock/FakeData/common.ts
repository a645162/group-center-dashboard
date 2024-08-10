export const getRandomInt = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomBool = (trueP: number = 50) => {
  return getRandomInt(100, 0) < trueP;
};

export const ceilAndTruncate = (num: number): string => {
  const ceilNum = Math.ceil(num);
  const truncatedNum = Math.trunc(ceilNum);
  return truncatedNum.toString();
};
