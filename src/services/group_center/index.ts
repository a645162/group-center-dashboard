// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Web前端获取GPU列表 GET /web/open/front_end/publicMachineList */
export async function getPublicMachineList(options?: { [key: string]: any }) {
  return request<API.FrontEndMachine[]>(
    '/web/open/front_end/publicMachineList',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Dashboard站点列表 GET /web/open/front_end/publicSiteClassList */
export async function getPublicSiteClassList(options?: { [key: string]: any }) {
  return request<API.DataDashBoardSiteClass[]>(
    '/web/open/front_end/publicSiteClassList',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
