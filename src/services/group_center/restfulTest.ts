// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get Test GET /test */
export async function getTest(options?: { [key: string]: any }) {
  return request<string>('/test', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Post Test POST /test */
export async function postTest(
  body: API.MyRequestBody,
  options?: { [key: string]: any },
) {
  return request<string>('/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
