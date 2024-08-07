// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 机器上的用户自定义消息 POST /api/client/user/message */
export async function machineUserMessage(
  body: API.MachineUserMessage,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/client/user/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
