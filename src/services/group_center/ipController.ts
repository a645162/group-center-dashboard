// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户的IP GET /web/open/ip */
export async function getUserIp(options?: { [key: string]: any }) {
  return request<string>('/web/open/ip', {
    method: 'GET',
    ...(options || {}),
  });
}
