// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Get Public Machine List for Web Frontend Retrieve list of all machines with public information for web frontend display GET /web/open/front_end/publicMachineList */
export async function getPublicMachineList(options?: { [key: string]: any }) {
  return request<API.FrontEndMachine[]>(
    '/web/open/front_end/publicMachineList',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get Dashboard Site Class List Retrieve list of dashboard site classes for frontend configuration GET /web/open/front_end/publicSiteClassList */
export async function getPublicSiteClassList(options?: { [key: string]: any }) {
  return request<API.DataDashBoardSiteClass[]>(
    '/web/open/front_end/publicSiteClassList',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
