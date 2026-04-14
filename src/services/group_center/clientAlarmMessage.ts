// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送报警消息到报警群 POST /api/client/alarm */
export async function sendAlarmMessage(
  body: API.ClientAlarmMessage,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/client/alarm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
