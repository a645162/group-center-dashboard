/**
 * 本地存储工具函数
 */

// 存储键名常量
export const STORAGE_KEYS = {
  SUBSCRIPTION_SELECTED_USER: 'subscription_selected_user',
  PROJECT_SUBSCRIPTION_SELECTED_USER: 'project_subscription_selected_user',
} as const;

/**
 * 获取本地存储的值
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting storage item for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 设置本地存储的值
 * @param key 存储键名
 * @param value 要存储的值
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item for key "${key}":`, error);
  }
}

/**
 * 移除本地存储的值
 * @param key 存储键名
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item for key "${key}":`, error);
  }
}

/**
 * 订阅管理相关的存储工具函数
 */

/**
 * 获取订阅管理选择的用户
 * @returns 选择的用户名，如果没有则为空字符串
 */
export function getSubscriptionSelectedUser(): string {
  return getStorageItem(STORAGE_KEYS.SUBSCRIPTION_SELECTED_USER, '');
}

/**
 * 设置订阅管理选择的用户
 * @param userName 用户名
 */
export function setSubscriptionSelectedUser(userName: string): void {
  setStorageItem(STORAGE_KEYS.SUBSCRIPTION_SELECTED_USER, userName);
}

/**
 * 获取项目订阅选择的用户
 * @returns 选择的用户名，如果没有则为空字符串
 */
export function getProjectSubscriptionSelectedUser(): string {
  return getStorageItem(STORAGE_KEYS.PROJECT_SUBSCRIPTION_SELECTED_USER, '');
}

/**
 * 设置项目订阅选择的用户
 * @param userName 用户名
 */
export function setProjectSubscriptionSelectedUser(userName: string): void {
  setStorageItem(STORAGE_KEYS.PROJECT_SUBSCRIPTION_SELECTED_USER, userName);
}
