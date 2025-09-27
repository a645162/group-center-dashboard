// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get Program Version Retrieve the current version of the application GET /version */
export async function version(options?: { [key: string]: any }) {
  return request<string>('/version', {
    method: 'GET',
    ...(options || {}),
  });
}
