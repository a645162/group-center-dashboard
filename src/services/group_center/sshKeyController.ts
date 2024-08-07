// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户上传SSH秘钥文件 POST /api/client/file/ssh_key */
export async function postSshFileUpload(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postSshFileUploadParams,
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<string>('/api/client/file/ssh_key', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/client/file/ssh_key/${param0} */
export async function getSshKeyFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSshKeyFileParams,
  options?: { [key: string]: any },
) {
  const { filename: param0, ...queryParams } = params;
  return request<any>(`/api/client/file/ssh_key/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
