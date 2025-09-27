// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 清除统计缓存 POST /web/dashboard/statistics/cache/clear */
export async function clearCache(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/web/dashboard/statistics/cache/clear', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 强制更新统计缓存 POST /web/dashboard/statistics/cache/update */
export async function forceUpdateCache(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/web/dashboard/statistics/cache/update', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取自定义时间段统计 GET /web/dashboard/statistics/custom */
export async function getCustomPeriodStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCustomPeriodStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/web/dashboard/statistics/custom', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get GPU Statistics Retrieve GPU usage statistics including utilization rates, task distribution, and performance metrics GET /web/dashboard/statistics/gpus */
export async function getGpuStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGpuStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/web/dashboard/statistics/gpus', {
    method: 'GET',
    params: {
      // timePeriod has a default value: ONE_WEEK
      timePeriod: 'ONE_WEEK',
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Project Statistics Retrieve project statistics including project counts, task distribution, and usage patterns GET /web/dashboard/statistics/projects */
export async function getProjectStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProjectStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/web/dashboard/statistics/projects', {
    method: 'GET',
    params: {
      // timePeriod has a default value: ONE_WEEK
      timePeriod: 'ONE_WEEK',
      ...params,
    },
    ...(options || {}),
  });
}

/** Get 24-Hour Report Retrieve comprehensive usage report for the last 24 hours including task counts, user activity, and resource utilization GET /web/dashboard/statistics/reports/24hour */
export async function get24HourReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/24hour',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get 48-Hour Report Retrieve comprehensive usage report for the last 48 hours with extended trend analysis GET /web/dashboard/statistics/reports/48hour */
export async function get48HourReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/48hour',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get 72-Hour Report Retrieve comprehensive usage report for the last 72 hours with detailed trend analysis and patterns GET /web/dashboard/statistics/reports/72hour */
export async function get72HourReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/72hour',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取月报 GET /web/dashboard/statistics/reports/monthly */
export async function getMonthlyReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/monthly',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get Today's Report Retrieve daily report for the current day (from 00:00 to 23:59) GET /web/dashboard/statistics/reports/today */
export async function getTodayReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/today',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取周报 GET /web/dashboard/statistics/reports/weekly */
export async function getWeeklyReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/weekly',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取年报 GET /web/dashboard/statistics/reports/yearly */
export async function getYearlyReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/yearly',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取昨日日报（昨天0:00到今天0:00） GET /web/dashboard/statistics/reports/yesterday */
export async function getYesterdayReport(options?: { [key: string]: any }) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/reports/yesterday',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get Server Statistics Retrieve server statistics including machine status, availability, and resource usage across all servers GET /web/dashboard/statistics/servers */
export async function getServerStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getServerStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/web/dashboard/statistics/servers', {
    method: 'GET',
    params: {
      // timePeriod has a default value: ONE_WEEK
      timePeriod: 'ONE_WEEK',
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取作息时间分析 GET /web/dashboard/statistics/sleep-analysis */
export async function getSleepAnalysis(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSleepAnalysisParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>(
    '/web/dashboard/statistics/sleep-analysis',
    {
      method: 'GET',
      params: {
        // timePeriod has a default value: ONE_WEEK
        timePeriod: 'ONE_WEEK',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** Get Time Trend Statistics Retrieve time-based trend statistics showing usage patterns over time (hourly/daily trends) GET /web/dashboard/statistics/time-trend */
export async function getTimeTrendStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTimeTrendStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/web/dashboard/statistics/time-trend', {
    method: 'GET',
    params: {
      // timePeriod has a default value: ONE_WEEK
      timePeriod: 'ONE_WEEK',
      ...params,
    },
    ...(options || {}),
  });
}

/** Get User Statistics Retrieve user statistics including active users, task counts, and usage patterns for the specified time period GET /web/dashboard/statistics/users */
export async function getUserStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/web/dashboard/statistics/users', {
    method: 'GET',
    params: {
      // timePeriod has a default value: ONE_WEEK
      timePeriod: 'ONE_WEEK',
      ...params,
    },
    ...(options || {}),
  });
}
