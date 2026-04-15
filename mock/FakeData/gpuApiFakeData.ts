import {
  getCurrentTimeStamp,
  getPreviousTimeStamp,
} from '../../src/utils/Time/DateTimeUtils';

import { getRandomBool, getRandomFloat, getRandomInt } from './common';

const basicGpuUsageInfo = {
  result: 1,
  gpuName: 'RTX 4090',
  coreUsage: 45,
  memoryUsage: 68.5,
  gpuMemoryUsage: '18432MiB',
  gpuMemoryTotal: '24GiB',
  gpuPowerUsage: 285,
  gpuTDP: 450,
  gpuTemperature: 52,
  gpuMemoryTotalMB: 24576,
};

const basicTaskDict = {
  id: 477998,
  name: 'konghaomin',
  debugMode: false,
  multiprocessingSpawn: false,
  projectDirectory: '/mnt/nvme0/data/konghaomin/sd_train',
  projectName: 'StableDiffusion',
  pyFileName: 'train_network.py',
  runTime: '3:24:15',
  startTimestamp: 1744712400000,
  gpuMemoryUsage: 8192,
  gpuMemoryUsageMax: 16384,
  worldSize: 1,
  localRank: 0,
  topPythonPid: 12345,
  condaEnv: 'py38',
  screenSessionName: 'sd',
  pythonVersion: '3.8.18',
  command: 'python train_network.py --config config.yaml',
  taskMainMemoryMB: 16384,
  cudaRoot: '/usr/local/cuda',
  cudaVersion: '12.4.1',
  cudaVisibleDevices: '0',
  driverVersion: '550.90.07',
  zeroAlreadyAlertedGpuUsage: false,
  zeroAlreadyAlertedCpuUsage: false,
  userEnvEpoch: '',
};

export const generateGpuCountResponse = (gpuCount: number) => {
  return {
    result: gpuCount,
    gpuCount: gpuCount,
  };
};

export const generateGpuUsageInfo = (gpuName: string) => {
  let finalGpuUsageInfo = { ...basicGpuUsageInfo };

  finalGpuUsageInfo.gpuName = gpuName;

  finalGpuUsageInfo.coreUsage = getRandomFloat(100, 0);
  finalGpuUsageInfo.memoryUsage = getRandomFloat(100, 0);
  finalGpuUsageInfo.gpuTemperature = getRandomFloat(85, 0);

  if (finalGpuUsageInfo.coreUsage > 90) {
    finalGpuUsageInfo.coreUsage = 100;
  }

  if (finalGpuUsageInfo.memoryUsage > 90) {
    finalGpuUsageInfo.memoryUsage = 100;
  }

  finalGpuUsageInfo.gpuPowerUsage = Math.floor(
    Math.random() * finalGpuUsageInfo.gpuTDP,
  );

  return finalGpuUsageInfo;
};

export const generateGpuTaskInfo = (taskCount: number) => {
  let taskList = [];

  const projectNames = [
    'StableDiffusion',
    'LLM_train',
    'VideoDiffusion',
    'ImageClassifier',
    'YOLOv8',
    'ResNet50',
    'BERTFineTune',
    'GAN_train',
    'SpeechRecognition',
    'NLP_transformer',
  ];

  const userNames = ['konghaomin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu'];

  const condaEnvs = ['py38', 'py39', 'py310', 'py311', 'torch2.0', 'tf2.14'];

  for (let i = 0; i < taskCount; i++) {
    let currentTask = { ...basicTaskDict };

    currentTask.debugMode = Math.random() < 0.2;
    currentTask.multiprocessingSpawn = Math.random() < 0.3;
    currentTask.name = userNames[getRandomInt(userNames.length - 1)];
    currentTask.projectName =
      projectNames[getRandomInt(projectNames.length - 1)];
    currentTask.condaEnv = condaEnvs[getRandomInt(condaEnvs.length - 1)];

    if (Math.random() < 0.5) {
      currentTask.screenSessionName =
        'screen_' + currentTask.projectName.toLowerCase();
    } else {
      currentTask.screenSessionName = '';
    }

    const hasZeroAlert = Math.random() < 0.1;
    currentTask.zeroAlreadyAlertedGpuUsage = hasZeroAlert;
    currentTask.zeroAlreadyAlertedCpuUsage = hasZeroAlert;

    currentTask.startTimestamp = getPreviousTimeStamp(
      getCurrentTimeStamp(),
      getRandomInt(72),
      getRandomInt(60),
    );

    taskList.push(currentTask);
  }

  return taskList;
};

const generateGpuTaskInfoMultiGpu = (devicesCount: number) => {
  const multiGpuTaskList = generateGpuTaskInfo(devicesCount);

  const topPythonPid = getRandomInt(1000, 65535);

  for (let i = 0; i < devicesCount; i++) {
    multiGpuTaskList[i].localRank = i;
    multiGpuTaskList[i].worldSize = devicesCount;
    multiGpuTaskList[i].topPythonPid = topPythonPid;
  }

  return multiGpuTaskList;
};

export const generateTaskInfoResponse = (
  taskCount: number,
  devicesCount: number = 1,
) => {
  const eachMaxCount = getRandomInt(taskCount, 1);
  const singleGpuTaskList = generateGpuTaskInfo(eachMaxCount);

  const multiGpuTaskList =
    getRandomBool() && devicesCount > 1
      ? generateGpuTaskInfoMultiGpu(devicesCount)
      : [];

  const taskList = [...singleGpuTaskList, ...multiGpuTaskList];

  return {
    result: taskCount,
    taskList: taskList,
  };
};
