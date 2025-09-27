// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 立即推送月报 POST /api/admin/report/push/monthly/now */
export async function pushMonthlyReportNow(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/admin/report/push/monthly/now', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 立即推送今日日报 POST /api/admin/report/push/today/now */
export async function pushTodayReportNow(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/admin/report/push/today/now', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 更新统计缓存 POST /api/admin/report/push/update-cache */
export async function updateStatisticsCache(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/admin/report/push/update-cache', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 立即推送周报 POST /api/admin/report/push/weekly/now */
export async function pushWeeklyReportNow(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/admin/report/push/weekly/now', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 立即推送年报 POST /api/admin/report/push/yearly/now */
export async function pushYearlyReportNow(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/admin/report/push/yearly/now', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 立即推送昨日日报 POST /api/admin/report/push/yesterday/now */
export async function pushYesterdayReportNow(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/admin/report/push/yesterday/now', {
    method: 'POST',
    ...(options || {}),
  });
}
