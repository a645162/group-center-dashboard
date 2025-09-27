// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** GPU任务变动 POST /api/client/gpu_task/info */
export async function postGpuTaskInfo1(
  body: API.GpuTaskInfo,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/client/gpu_task/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
