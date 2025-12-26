// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

/**
 * 过滤掉版本号中的 ^ 符号
 * @param version 版本号字符串
 * @returns 过滤后的版本号
 */
export function removeVersionCaret(version: string): string {
  return version.replace(/^\^/, '');
}

/**
 * 过滤掉版本号中的 ~ 符号
 * @param version 版本号字符串
 * @returns 过滤后的版本号
 */
export function removeVersionTilde(version: string): string {
  return version.replace(/^~/, '');
}

/**
 * 过滤掉版本号中的所有符号（^、~等）
 * @param version 版本号字符串
 * @returns 过滤后的版本号
 */
export function cleanVersion(version: string): string {
  return version.replace(/^[\^~]/, '');
}
