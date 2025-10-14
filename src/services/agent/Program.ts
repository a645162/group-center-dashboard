import ConcatUrl from '@/services/ConcatUrl';
import { request } from '@umijs/max';

export async function updateNviNotify(apiBaseUrl: string) {
  return request<API.ProgramUpdateResponse>(
    ConcatUrl(apiBaseUrl, 'update_nvi_notify'),
    {
      method: 'GET',
    },
  );
}
