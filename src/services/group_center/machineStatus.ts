// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get All Machine Status Retrieve status information for all machines including ping status, agent status, and last update times GET /api/machine/status */
export async function getAllMachineStatus(options?: { [key: string]: any }) {
  return request<API.MachineStatusResponse[]>('/api/machine/status', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get Specific Machine Status Retrieve detailed status information for a specific machine by its English name GET /api/machine/status/${param0} */
export async function getMachineStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMachineStatusParams,
  options?: { [key: string]: any },
) {
  const { nameEng: param0, ...queryParams } = params;
  return request<API.MachineStatusResponse>(`/api/machine/status/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Get Machine Status Summary Retrieve summary statistics for all machines including online counts and availability rates GET /api/machine/status/summary */
export async function getMachineStatusSummary(options?: {
  [key: string]: any;
}) {
  return request<Record<string, any>>('/api/machine/status/summary', {
    method: 'GET',
    ...(options || {}),
  });
}
