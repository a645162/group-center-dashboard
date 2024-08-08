declare namespace API {
  interface MachineSystemInfo {
    memoryPhysicTotalMb: number;
    memoryPhysicUsedMb: number;

    memorySwapTotalMb: number;
    memorySwapUsedMb: number;
  }
  interface DashboardGpuCount {
    result: number;
  }
  interface DashboardGpuUsageInfo {
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
  interface DashboardGpuTaskItemInfo {
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
  interface DashboardGpuTaskItemInfoResponse {
    result: number;
    taskList: API.DashboardGpuTaskItemInfo[];
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
    data?: API.DashboardGpuCount;
  }
  interface Result_GpuUsageInfo {
    success?: boolean;
    errorMessage?: string;
    data?: API.DashboardGpuUsageInfo;
  }
  interface Result_GpuTaskInfo {
    success?: boolean;
    errorMessage?: string;
    data?: API.DashboardGpuTaskItemInfoResponse;
  }
}
