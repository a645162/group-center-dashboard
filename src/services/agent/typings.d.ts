declare namespace API {
  interface MachineSystemInfo {
    memoryPhysicTotalMb: number;
    memoryPhysicUsedMb: number;

    memorySwapTotalMb: number;
    memorySwapUsedMb: number;
  }

  interface MachineDiskUsage {
    mountPoint: string;

    usePercentage: number;

    usedStr: string;
    freeStr: string;
    totalStr: string;

    triggerHighPercentageUsed: boolean;
    triggerLowFreeBytes: boolean;
    triggerSizeWarning: boolean;

    type: string;
    purpose: string;
  }
  interface MachineDiskUsageResponse {
    result: number;
    diskUsage: API.MachineDiskUsage[];
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

    driverVersion: string;
  }
  interface DashboardGpuTaskItemInfoResponse {
    result: number;
    taskList: API.DashboardGpuTaskItemInfo[];
  }
}
