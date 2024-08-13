import {
  getCurrentTimeStamp,
  getPreviousTimeStamp,
} from '../../src/utils/Time/DateTimeUtils';

import { getRandomBool, getRandomFloat, getRandomInt } from './common';

const basicGpuUsageInfo = {
  result: 1,
  gpuName: 'RTX 3090',
  coreUsage: 79,
  memoryUsage: 54.6,
  gpuMemoryUsage: '13412MiB',
  gpuMemoryTotal: '23.99GiB',
  gpuPowerUsage: 271,
  gpuTDP: 350,
  gpuTemperature: 60,
  gpuMemoryTotalMB: 24564,
};

const basicTaskDict = {
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
  topPythonPid: -1,
  condaEnv: 'khm3.8',
  screenSessionName: 'khm',
  pythonVersion: '3.8.16',
  command: 'python train.py',
  taskMainMemoryMB: 5263,
  cudaRoot: '/usr/local/cuda',
  cudaVersion: '12.1.105',
  cudaVisibleDevices: '',
  driverVersion: '555.42.06',
};

export const generateGpuCountResponse = (gpuCount: number) => {
  const gpuCountResponse = {
    result: gpuCount,
    gpuCount: gpuCount,
  };

  return gpuCountResponse;
};

export const generateGpuUsageInfo = (gpuName: string) => {
  let finalGpuUsageInfo = { ...basicGpuUsageInfo };

  finalGpuUsageInfo.gpuName = gpuName;

  finalGpuUsageInfo.coreUsage = getRandomFloat(100, 0);
  finalGpuUsageInfo.memoryUsage = getRandomFloat(100, 0);
  finalGpuUsageInfo.gpuTemperature = getRandomFloat(85, 0);

  finalGpuUsageInfo.gpuPowerUsage = Math.floor(
    Math.random() * finalGpuUsageInfo.gpuTDP,
  );

  return finalGpuUsageInfo;
};

export const generateGpuTaskInfo = (taskCount: number) => {
  let taskList = [];

  for (let i = 0; i < taskCount; i++) {
    let currentTask = { ...basicTaskDict };

    currentTask.debugMode = Math.random() < 0.5; // 50% debugMode
    currentTask.name = 'User ' + getRandomInt(9);
    currentTask.projectName = 'Project ' + (i + 1).toString();
    if (Math.random() < 0.5) {
      currentTask.screenSessionName = 'Screen ' + (i + 1).toString();
    } else {
      currentTask.screenSessionName = '';
    }

    currentTask.startTimestamp = getPreviousTimeStamp(
      getCurrentTimeStamp(),
      getRandomInt(24),
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
  devicesCount: number = 2,
) => {
  const eachMaxCount = getRandomInt(taskCount, 1);
  const singleGpuTaskList = generateGpuTaskInfo(eachMaxCount);

  const multiGpuTaskList = getRandomBool()
    ? generateGpuTaskInfoMultiGpu(devicesCount)
    : [];

  const taskList = [...singleGpuTaskList, ...multiGpuTaskList];

  const taskInfoResponse = {
    result: taskCount,
    taskList: taskList,
  };

  return taskInfoResponse;
};
