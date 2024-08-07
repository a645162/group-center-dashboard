// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** GET 程序版本 GET /version */
export async function version(options?: { [key: string]: any }) {
  return request<string>('/version', {
    method: 'GET',
    ...(options || {}),
  });
}
