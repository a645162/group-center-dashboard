// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/client/hardware/disk_usage_user */
export async function postGpuTaskInfo(
  body: API.HardDiskUserUsage,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/client/hardware/disk_usage_user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
