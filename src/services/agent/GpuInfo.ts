import ConcatUrl from '@/services/ConcatUrl';
import { request } from '@umijs/max';

export async function getGpuCount(apiBaseUrl: string) {
  return request<API.DashboardGpuCount>(ConcatUrl(apiBaseUrl, 'gpu_count'), {
    method: 'GET',
  });
}

export async function getGpuUsageInfo(apiBaseUrl: string, gpuIndex: number) {
  return request<API.DashboardGpuUsageInfo>(
    ConcatUrl(apiBaseUrl, '/gpu_usage_info'),
    {
      method: 'GET',
      params: {
        gpuIndex: gpuIndex,
      },
    },
  );
}

export async function getGpuTaskInfo(apiBaseUrl: string, gpuIndex: number) {
  return request<API.DashboardGpuTaskItemInfoResponse>(
    ConcatUrl(apiBaseUrl, '/gpu_task_info'),
    {
      method: 'GET',
      params: {
        gpuIndex: gpuIndex,
      },
    },
  );
}
