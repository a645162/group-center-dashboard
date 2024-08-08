import { getCookie, setCookie } from 'typescript-cookie';

// https://www.npmjs.com/package/typescript-cookie

export const getLatestRunGpu = async () => {
  return getCookie('latestGpuDashboardGpu');
};

export const setLatestRunGpu = async (gpuNameShort: string) => {
  return setCookie('latestGpuDashboardGpu', gpuNameShort);
};
