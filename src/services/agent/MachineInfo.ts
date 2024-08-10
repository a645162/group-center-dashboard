import ConcatUrl from '@/services/ConcatUrl';
import { request } from '@umijs/max';

export async function getMachineSystemInfo(apiBaseUrl: string) {
  return request<API.MachineSystemInfo>(ConcatUrl(apiBaseUrl, 'system_info'), {
    method: 'GET',
  });
}

export async function getDiskUsage(apiBaseUrl: string) {
  return request<API.MachineDiskUsageResponse>(
    ConcatUrl(apiBaseUrl, 'disk_usage'),
    {
      method: 'GET',
    },
  );
}
