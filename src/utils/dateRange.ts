/**
 * 根据时间范围类型计算具体的开始和结束日期
 * @param timePeriod 时间范围类型
 * @returns 格式化后的日期范围字符串
 */
export const calculateDateRange = (timePeriod: string): string => {
  const now = new Date();
  const endDate = new Date(now);

  let startDate = new Date(now);

  switch (timePeriod) {
    case 'ONE_DAY':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'ONE_WEEK':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'ONE_MONTH':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'SIX_MONTH':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'ONE_YEAR':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // 默认显示一周
      startDate.setDate(now.getDate() - 7);
      break;
  }

  // 格式化日期为 YYYY-MM-DD 格式
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)} 至 ${formatDate(endDate)}`;
};

/**
 * 获取时间范围的中文显示名称
 * @param timePeriod 时间范围类型
 * @returns 中文显示名称
 */
export const getTimeRangeDisplayName = (timePeriod: string): string => {
  const rangeMap: Record<string, string> = {
    ONE_DAY: '24小时',
    ONE_WEEK: '1周',
    ONE_MONTH: '1月',
    SIX_MONTH: '6个月',
    ONE_YEAR: '1年',
  };

  return rangeMap[timePeriod] || timePeriod;
};
