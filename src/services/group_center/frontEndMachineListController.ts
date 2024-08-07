// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Web前端获取GPU列表 GET /web/open/front_end/machineList */
export async function getMachineList(options?: { [key: string]: any }) {
  return request<API.FrontEndMachine[]>('/web/open/front_end/machineList', {
    method: 'GET',
    ...(options || {}),
  });
}
