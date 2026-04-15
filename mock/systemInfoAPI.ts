const systemInfoTemplate = {
  result: 1,
  machineName: 'GPU Server',
  cpuModel: 'AMD EPYC 9654',
  cpuCores: 192,
  cpuThreads: 384,
  cpuUsage: 15.5,
  memoryPhysicTotalMb: 1048576,
  memoryPhysicUsedMb: 327680,
  memorySwapTotalMb: 8192,
  memorySwapUsedMb: 1024,
  diskTotalGb: 4096,
  diskUsedGb: 1536,
  osName: 'Ubuntu 22.04 LTS',
  osVersion: '5.15.0-91-generic',
  kernelVersion: '5.15.0',
  uptime: 1728000,
};

const generateSystemInfo = (gpuCount: number = 8) => {
  const info = { ...systemInfoTemplate };

  info.memoryPhysicUsedMb = Math.floor(Math.random() * 524288) + 131072;
  info.memorySwapUsedMb = Math.floor(Math.random() * 2048) + 256;
  info.cpuUsage = Math.floor(Math.random() * 30) + 5;
  info.diskUsedGb = Math.floor(Math.random() * 1024) + 512;

  return info;
};

export default {
  '/gpu/3090-gpu1/system_info': (req: any, res: any) => {
    res.json(generateSystemInfo(1));
  },
  '/gpu/4090-gpu1/system_info': (req: any, res: any) => {
    res.json(generateSystemInfo(1));
  },
  '/gpu/4090-gpu2/system_info': (req: any, res: any) => {
    res.json(generateSystemInfo(1));
  },
  '/gpu/4090a/system_info': (req: any, res: any) => {
    res.json(generateSystemInfo(4));
  },
  '/gpu/4090b/system_info': (req: any, res: any) => {
    res.json(generateSystemInfo(4));
  },
  '/gpu/h100-01/system_info': (req: any, res: any) => {
    res.json(generateSystemInfo(8));
  },
};
