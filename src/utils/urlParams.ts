/**
 * URL参数管理工具函数
 * 用于处理过滤器参数与URL的同步
 */

import { history } from '@umijs/max';

/**
 * 获取当前URL的所有参数
 */
export const getUrlParams = (): Record<string, string> => {
  const searchParams = new URLSearchParams(history.location.search);
  const params: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
};

/**
 * 获取指定URL参数的值
 */
export const getUrlParam = (key: string): string | null => {
  const searchParams = new URLSearchParams(history.location.search);
  return searchParams.get(key);
};

/**
 * 设置URL参数
 */
export const setUrlParam = (key: string, value: string): void => {
  const searchParams = new URLSearchParams(history.location.search);

  if (value) {
    searchParams.set(key, value);
  } else {
    searchParams.delete(key);
  }

  updateUrl(searchParams);
};

/**
 * 设置多个URL参数
 */
export const setUrlParams = (params: Record<string, string>): void => {
  const searchParams = new URLSearchParams(history.location.search);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });

  updateUrl(searchParams);
};

/**
 * 删除URL参数
 */
export const removeUrlParam = (key: string): void => {
  const searchParams = new URLSearchParams(history.location.search);
  searchParams.delete(key);
  updateUrl(searchParams);
};

/**
 * 删除多个URL参数
 */
export const removeUrlParams = (keys: string[]): void => {
  const searchParams = new URLSearchParams(history.location.search);

  keys.forEach((key) => {
    searchParams.delete(key);
  });

  updateUrl(searchParams);
};

/**
 * 清除所有URL参数
 */
export const clearUrlParams = (): void => {
  updateUrl(new URLSearchParams());
};

/**
 * 更新URL
 */
const updateUrl = (searchParams: URLSearchParams): void => {
  const newSearch = searchParams.toString();
  const newUrl = newSearch
    ? `${history.location.pathname}?${newSearch}`
    : history.location.pathname;

  history.replace(newUrl);
};

/**
 * 解析GPU ID数组
 */
export const parseGpuIds = (gpuIdsStr: string): number[] => {
  if (!gpuIdsStr) return [];

  return gpuIdsStr
    .split(',')
    .map((id) => parseInt(id.trim()))
    .filter((id) => !isNaN(id) && id >= 0);
};

/**
 * 序列化GPU ID数组
 */
export const serializeGpuIds = (gpuIds: number[]): string => {
  return gpuIds.join(',');
};

/**
 * 解析GPU范围
 */
export const parseGpuRange = (
  rangeStr: string,
): { min: number; max: number } | undefined => {
  if (!rangeStr) return undefined;

  const [minStr, maxStr] = rangeStr.split('-');
  const min = parseInt(minStr?.trim());
  const max = parseInt(maxStr?.trim());

  if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
    return undefined;
  }

  return { min, max };
};

/**
 * 序列化GPU范围
 */
export const serializeGpuRange = (
  range: { min: number; max: number } | undefined,
): string => {
  if (!range) return '';
  return `${range.min}-${range.max}`;
};

/**
 * 检查URL参数是否包含过滤器
 */
export const hasFilterParams = (): boolean => {
  const params = getUrlParams();
  const filterKeys = ['user', 'project', 'gpuIds', 'gpuRange', 'multiGpu'];

  return filterKeys.some((key) => params[key]);
};

export default {
  getUrlParams,
  getUrlParam,
  setUrlParam,
  setUrlParams,
  removeUrlParam,
  removeUrlParams,
  clearUrlParams,
  parseGpuIds,
  serializeGpuIds,
  parseGpuRange,
  serializeGpuRange,
  hasFilterParams,
};
