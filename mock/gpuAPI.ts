const gpu_usage_info = {
  result: 1,
  gpuName: 'RTX 3090',
  coreUsage: 79,
  memoryUsage: 54.6,
  gpuMemoryUsage: '13412MiB',
  gpuMemoryTotal: '23.99GiB',
  gpuPowerUsage: 271,
  gpuTDP: 450,
  gpuTemperature: 60,
  gpuMemoryTotalMB: 24564,
};

const gpu_task_info = {
  result: 1,
  taskList: [
    {
      id: 477998,
      name: '孔昊旻',
      debugMode: false,
      projectDirectory: '/mnt/hdd1/data/konghaomin/123',
      projectName: '123',
      pyFileName: 'train.py',
      runTime: '1:00:27',
      startTimestamp: 1723008640000,
      gpuMemoryUsage: 13572,
      gpuMemoryUsageMax: 17760,
      worldSize: 0,
      localRank: 0,
      condaEnv: 'khm3.8',
      screenSessionName: 'khm',
      pythonVersion: '3.8.16',
      command: 'python train.py',
      taskMainMemoryMB: 5263,
      cudaRoot: '/usr/local/cuda-12.1',
      cudaVersion: '12.1.105',
      cudaVisibleDevices: '',
      driverVersion: '555.42.06',
    },
  ],
};

export default {
  'GET /gpu_usage_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: gpu_usage_info,
      errorCode: 0,
    });
  },
  'GET /gpu_task_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: gpu_task_info,
      errorCode: 0,
    });
  },
};
