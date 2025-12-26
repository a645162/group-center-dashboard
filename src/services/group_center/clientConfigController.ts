// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 客户端获取环境变量列表 GET /api/client/config/env_list */
export async function getEnvList(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/client/config/env_list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 客户端获取服务器列表 GET /api/client/config/machine_list */
export async function getMachineBaseList(options?: { [key: string]: any }) {
  return request<API.MachineBaseConfig[]>('/api/client/config/machine_list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 客户端获取环境用户列表 GET /api/client/config/user_list */
export async function getUserList1(options?: { [key: string]: any }) {
  return request<API.GroupUserConfig[]>('/api/client/config/user_list', {
    method: 'GET',
    ...(options || {}),
  });
}
