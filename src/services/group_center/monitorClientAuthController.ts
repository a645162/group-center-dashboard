// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 认证GPU监控客户端 GET /auth/client/auth */
export async function auth(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.authParams,
  options?: { [key: string]: any },
) {
  return request<API.AuthResponse>('/auth/client/auth', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
