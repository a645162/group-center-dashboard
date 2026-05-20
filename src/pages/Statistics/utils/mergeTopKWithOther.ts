interface PieChartDataItem {
  type: string;
  value: number;
  percentage?: string;
  [key: string]: any;
}

/**
 * 对饼图数据进行 topK 截断，并将剩余项合并为"其他"类别
 * @param data 完整的饼图数据数组（需包含 type 和 value 字段）
 * @param topK 取前K项，null表示不截断
 * @param mergeExtraFields 合并"其他"项时的额外字段计算函数，参数为被截断的剩余项数组
 */
export function mergeTopKWithOther(
  data: PieChartDataItem[],
  topK: number | null,
  mergeExtraFields?: (
    remainingItems: PieChartDataItem[],
  ) => Record<string, any>,
): PieChartDataItem[] {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const topItems = topK ? data.slice(0, topK) : data;

  const result = topItems.map((item) => ({
    ...item,
    percentage:
      totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0',
  }));

  if (topK && data.length > topK) {
    const remainingItems = data.slice(topK);
    const remainingValue = remainingItems.reduce(
      (sum, item) => sum + item.value,
      0,
    );
    result.push({
      ...(mergeExtraFields?.(remainingItems) || {}),
      type: '其他',
      value: remainingValue,
      percentage:
        totalValue > 0 ? ((remainingValue / totalValue) * 100).toFixed(1) : '0',
    });
  }

  return result;
}
