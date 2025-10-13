// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 订阅项目 用户订阅指定项目，项目完成时会收到通知 POST /api/public/projects/subscribe */
export async function subscribeProject(
  body: API.ProjectSubscriptionRequest,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/public/projects/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户订阅列表 获取指定用户订阅的所有项目列表 GET /api/public/projects/subscriptions */
export async function getUserSubscriptions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserSubscriptionsParams,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/public/projects/subscriptions', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 取消订阅项目 用户取消订阅指定项目 POST /api/public/projects/unsubscribe */
export async function unsubscribeProject(
  body: API.ProjectSubscriptionRequest,
  options?: { [key: string]: any },
) {
  return request<API.ClientResponse>('/api/public/projects/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户列表 获取所有用户的用户名和英文名列表 GET /api/public/users */
export async function getUserList(options?: { [key: string]: any }) {
  return request<API.ClientResponse>('/api/public/users', {
    method: 'GET',
    ...(options || {}),
  });
}
