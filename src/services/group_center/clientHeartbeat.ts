// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** Agent心跳保活 POST /api/client/heartbeat */
export async function processHeartbeat(
  body: API.MachineHeartbeat,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/client/heartbeat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
