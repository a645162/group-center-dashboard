declare namespace API {
  type AllWebHookUser = {
    silentMode: SilentModeConfig;
    weCom: WeComUser;
    lark: LarkUser;
  };

  type authParams = {
    userName: string;
    password: string;
  };

  type AuthResponse = {
    isAuthenticated: boolean;
    isSucceed: boolean;
    haveError: boolean;
    result: string;
    accessKey: string;
    ipAddress: string;
    rememberAuthIp: boolean;
    serverVersion: string;
    succeed?: boolean;
    authenticated?: boolean;
  };

  type ClientResponse = {
    serverVersion: string;
    isAuthenticated: boolean;
    haveError: boolean;
    isSucceed: boolean;
    result: string;
    succeed?: boolean;
    authenticated?: boolean;
  };

  type FrontEndMachine = {
    machineName: string;
    machineUrl: string;
    urlKeywords: string[];
    position: string;
  };

  type getSshKeyFileParams = {
    filename: string;
    userNameEng: string;
  };

  type GpuTaskInfo = {
    serverName: string;
    serverNameEng: string;
    taskId: string;
    messageType: string;
    taskType: string;
    taskStatus: string;
    taskUser: string;
    taskPid: number;
    taskMainMemory: number;
    allTaskMessage: string;
    gpuUsagePercent: number;
    gpuMemoryUsageString: string;
    gpuMemoryFreeString: string;
    gpuMemoryTotalString: string;
    gpuMemoryPercent: number;
    taskGpuId: number;
    taskGpuName: string;
    taskGpuMemoryGb: number;
    taskGpuMemoryHuman: string;
    taskGpuMemoryMaxGb: number;
    isMultiGpu: boolean;
    multiDeviceLocalRank: number;
    multiDeviceWorldSize: number;
    cudaRoot: string;
    cudaVersion: string;
    isDebugMode: boolean;
    taskStartTime: number;
    taskFinishTime: number;
    taskRunningTimeString: string;
    taskRunningTimeInSeconds: number;
    projectDirectory: string;
    projectName: string;
    screenSessionName: string;
    pyFileName: string;
    pythonVersion: string;
    commandLine: string;
    condaEnvName: string;
    debugMode?: boolean;
    multiGpu?: boolean;
  };

  type GroupUserConfig = {
    name: string;
    nameEng: string;
    keywords: string[];
    year: number;
    linuxUser: LinuxUser;
    webhook: AllWebHookUser;
  };

  type LarkUser = {
    enable: boolean;
    userId: string;
    userMobilePhone: string;
  };

  type LinuxUser = {
    uid: number;
    gid: number;
  };

  type MachineBaseConfig = {
    name: string;
    nameEng: string;
    host: string;
  };

  type MachineUserMessage = {
    userName: string;
    content: string;
  };

  type MyRequestBody = {
    property1: string;
    property2: number;
  };

  type postSshFileUploadParams = {
    userNameEng: string;
  };

  type SilentModeConfig = {
    enable: boolean;
    startTime: string;
    endTime: string;
    startTimeObj: TimeHM;
    endTimeObj: TimeHM;
    isValid: boolean;
    isSilentMode: boolean;
  };

  type TimeHM = {
    hour: number;
    minute: number;
  };

  type WeComUser = {
    enable: boolean;
    userId: string;
    userMobilePhone: string;
  };
}
