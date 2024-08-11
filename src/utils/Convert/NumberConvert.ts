export const ConvertNumberToCircle = (num: number) => {
  switch (num) {
    case 0:
      return '○';
    case 1:
      return '①';
    case 2:
      return '②';
    case 3:
      return '③';
    case 4:
      return '④';
    case 5:
      return '⑤';
    case 6:
      return '⑥';
    case 7:
      return '⑦';
    case 8:
      return '⑧';
    case 9:
      return '⑨';
    default:
      return `(${num})`;
  }
};
