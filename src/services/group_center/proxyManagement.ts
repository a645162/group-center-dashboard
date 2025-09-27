// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Trigger Manual Health Check Manually trigger health check for all proxy servers and return immediate results POST /api/proxy/health-check */
export async function triggerHealthCheck(options?: { [key: string]: any }) {
  return request<API.HealthCheckResponse>('/api/proxy/health-check', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Reload Proxy Configuration Reload proxy configuration from file without restarting the application POST /api/proxy/reload-config */
export async function reloadConfig(options?: { [key: string]: any }) {
  return request<API.ReloadConfigResponse>('/api/proxy/reload-config', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Get All Proxy Servers Retrieve status and details for all configured proxy servers GET /api/proxy/servers */
export async function getAllProxyServers(options?: { [key: string]: any }) {
  return request<API.ProxyServersResponse>('/api/proxy/servers', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get Specific Proxy Server Retrieve status and details for a specific proxy server by name GET /api/proxy/servers/${param0} */
export async function getProxyServer(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProxyServerParams,
  options?: { [key: string]: any },
) {
  const { nameEng: param0, ...queryParams } = params;
  return request<API.ProxyServerResponse>(`/api/proxy/servers/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Get Proxy Status Summary Retrieve overall proxy system status including availability rates and configuration status GET /api/proxy/status */
export async function getProxyStatus(options?: { [key: string]: any }) {
  return request<API.ProxyStatusResponse>('/api/proxy/status', {
    method: 'GET',
    ...(options || {}),
  });
}
