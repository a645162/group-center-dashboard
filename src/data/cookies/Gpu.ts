import '@/services/group_center/typings.d';
import { getCookie, setCookie } from 'typescript-cookie';

// https://www.npmjs.com/package/typescript-cookie

const getLatestRunGpuStr = async () => {
  return getCookie('latestGpuDashboardGpu');
};

const setLatestRunGpuStr = async (content: string) => {
  console.log('Try to write cookies', 'latestGpuDashboardGpu', content);
  return setCookie('latestGpuDashboardGpu', content);
};

export const getLatestRunGpu = async (): Promise<API.FrontEndMachine[]> => {
  const jsonString = await getLatestRunGpuStr();
  if (!jsonString || jsonString.length === 0) {
    return [];
  }

  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

export const setLatestRunGpu = async (machineList: API.FrontEndMachine[]) => {
  const jsonString = JSON.stringify(machineList);

  return await setLatestRunGpuStr(jsonString);
};

export default {
  getLatestRunGpu,
  setLatestRunGpu,
};
