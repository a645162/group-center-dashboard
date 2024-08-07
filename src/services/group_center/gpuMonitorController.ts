// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** GPU监控客户端程序启动 POST /api/client/start */
export async function monitorStart(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/client/start', {
    method: 'POST',
    ...(options || {}),
  });
}
