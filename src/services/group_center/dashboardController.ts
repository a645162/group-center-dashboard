// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新面板 GET /web/dashboard/usage/update */
export async function gpuTaskInfo(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/web/dashboard/usage/update', {
    method: 'GET',
    ...(options || {}),
  });
}
