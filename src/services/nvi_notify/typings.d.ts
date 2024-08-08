declare namespace API {
  interface MachineSystemInfo {
    memoryPhysicTotalMb: number;
    memoryPhysicUsedMb: number;

    memorySwapTotalMb: number;
    memorySwapUsedMb: number;
  }
  interface GpuCount {
    result: number;
  }
  interface GpuUsageInfo {
    result: string;
    gpuName: string;
    coreUsage: number;
    memoryUsage: number;
    gpuMemoryTotalMB: number;
    gpuMemoryTotal: string;
    gpuPowerUsage: number;
    gpuTDP: number;
    gpuTemperature: number;
  }
  interface GpuTaskInfo {
    id: number;
    name: string;

    debugMode: boolean;

    projectDirectory: string;
    projectName: string;
    pyFileName: string;

    runTime: string;
    startTimestamp: number;

    gpuMemoryUsage: number;
    gpuMemoryUsageMax: number;

    worldSize: number;
    localRank: number;
    condaEnv: string;
    screenSessionName: string;

    pythonVersion: string;

    mainName: string;

    command: string;

    taskMainMemoryMB: number;

    cudaRoot: string;
    cudaVersion: string;
    cudaVisibleDevices: string;
  }
  interface GpuTaskInfoResponse {
    result: number;
    taskList: API.GpuTaskInfo[];
  }

  // AxioResponse
  interface Result_MachineSystemInfo {
    success?: boolean;
    errorMessage?: string;
    data?: API.MachineSystemInfo;
  }
  interface Result_GpuCount {
    success?: boolean;
    errorMessage?: string;
    data?: API.GpuCount;
  }
  interface Result_GpuUsageInfo {
    success?: boolean;
    errorMessage?: string;
    data?: API.GpuUsageInfo;
  }
  interface Result_GpuTaskInfo {
    success?: boolean;
    errorMessage?: string;
    data?: GpuTaskInfoResponse;
  }
}
