import { getRandomFloat, getRandomInt } from './common';

const gpuModels = [
  'NVIDIA RTX 4090',
  'NVIDIA RTX 3090',
  'NVIDIA A100-SXM4-80GB',
  'NVIDIA H100-SXM5-80GB',
  'NVIDIA RTX 4090D',
  'NVIDIA A800-SXM4-80GB',
  'NVIDIA V100-SXM2-32GB',
  'NVIDIA RTX 3080',
];

const serverNames = [
  '4090-GPU1',
  '4090-GPU2',
  '3090-GPU1',
  'H100-01',
  'A100-01',
  'A800-01',
  'V100-01',
  '4090A-4GPU',
  '4090B-4GPU',
];

const userNames = [
  'zhangsan',
  'lisi',
  'wangwu',
  'zhaoliu',
  'chenqi',
  'sunba',
  'zhoujiu',
  'wushi',
  'liuyi',
  'qianer',
  'huangsan',
  'xusi',
  'dengwu',
  'fengliu',
  'caiqi',
  'weiba',
  'xujiu',
  'heshi',
  'jiangyi',
  'haner',
  'lvming',
  'songhua',
  'tanglong',
  'yanfei',
  'guangzhou',
  'shenzhen',
  'beijing',
  'shanghai',
  'chengdu',
  'hangzhou',
];

const projectNames = [
  'LLM-Training',
  'Diffusion-Model',
  'NLP-Research',
  'CV-Detection',
  'Speech-Recognition',
  'Reinforcement-Learning',
  'GAN-Generation',
  'Transformer-Optimization',
  'MultiModal-Fusion',
  'Knowledge-Distillation',
  'Federated-Learning',
  'AutoML-Search',
  'Graph-Neural-Network',
  'Time-Series-Forecast',
  'Anomaly-Detection',
  'Recommendation-System',
  'Text-Summarization',
  'Image-Segmentation',
  'Video-Understanding',
  '3D-Reconstruction',
  'Medical-Imaging',
  'Autonomous-Driving',
  'Robotics-Perception',
  'NLP-Translation',
  'Sentiment-Analysis',
  'Code-Generation',
  'Protein-Structure',
  'Drug-Discovery',
  'Climate-Modeling',
  'Financial-Prediction',
];

export const generateGpuStats = () => {
  return serverNames.map((server) => {
    const gpuModel = gpuModels[getRandomInt(gpuModels.length - 1)];
    const totalUsageCount = getRandomInt(200, 5);
    const totalRuntime = getRandomInt(500000, 10000);
    const averageMemoryUsage = getRandomFloat(80, 20);
    const totalMemoryUsage = getRandomFloat(700, 100);
    return {
      gpuName: gpuModel,
      serverName: server,
      totalUsageCount,
      totalRuntime,
      averageMemoryUsage,
      totalMemoryUsage,
      formattedAverageMemoryUsage: Number(averageMemoryUsage.toFixed(1)),
      formattedTotalMemoryUsage: Number(totalMemoryUsage.toFixed(1)),
    };
  });
};

export const generateUserStats = () => {
  return userNames.map((userName) => {
    const totalTasks = getRandomInt(150, 1);
    const totalRuntime = getRandomInt(800000, 5000);
    const averageRuntime = getRandomInt(totalRuntime / totalTasks + 100, 500);
    return {
      userName,
      totalTasks,
      totalRuntime,
      averageRuntime,
      favoriteGpu: gpuModels[getRandomInt(gpuModels.length - 1)],
      favoriteProject: projectNames[getRandomInt(projectNames.length - 1)],
      formattedAverageRuntime: Number((averageRuntime / 3600).toFixed(1)),
    };
  });
};

export const generateProjectStats = () => {
  return projectNames.map((projectName) => {
    const totalTasks = getRandomInt(300, 2);
    const totalRuntime = getRandomInt(2000000, 10000);
    const averageRuntime = getRandomInt(totalRuntime / totalTasks + 200, 800);
    const activeUsersCount = getRandomInt(15, 1);
    const activeUsers = userNames.slice(0, activeUsersCount);
    return {
      projectName,
      totalRuntime,
      totalTasks,
      activeUsers,
      averageRuntime,
      activeUsersCount,
      formattedAverageRuntime: Number((averageRuntime / 3600).toFixed(1)),
    };
  });
};

export const generateDailyStats = (days: number) => {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const activeUsersCount = getRandomInt(20, 3);
    const activeUsers = userNames.slice(0, activeUsersCount);
    result.push({
      date: dateStr,
      totalTasks: getRandomInt(80, 10),
      totalRuntime: getRandomInt(500000, 50000),
      activeUsers,
      peakGpuUsage: getRandomFloat(95, 30),
      activeUsersCount,
      formattedPeakGpuUsage: getRandomFloat(95, 30),
    });
  }
  return result;
};

export const generateTimeTrendData = (timePeriod: string) => {
  const daysMap: Record<string, number> = {
    ONE_DAY: 1,
    ONE_WEEK: 7,
    ONE_MONTH: 30,
    SIX_MONTH: 180,
    ONE_YEAR: 365,
  };
  const days = daysMap[timePeriod] || 7;
  const dailyStats = generateDailyStats(days);
  const totalTasks = dailyStats.reduce((sum, d) => sum + d.totalTasks, 0);
  const totalRuntime = dailyStats.reduce((sum, d) => sum + d.totalRuntime, 0);
  const allUsers = new Set<string>();
  dailyStats.forEach((d) => d.activeUsers.forEach((u) => allUsers.add(u)));

  return {
    period: timePeriod,
    dailyStats,
    totalTasks,
    totalRuntime,
    totalUsers: allUsers.size,
    averageDailyTasks: Number((totalTasks / days).toFixed(1)),
    averageDailyRuntime: Number((totalRuntime / days).toFixed(1)),
  };
};

export const generateUserActivityTimeData = () => {
  const users = userNames.slice(0, 20).map((userName) => {
    const startHour = getRandomInt(22, 6);
    const startMinute = getRandomInt(59, 0);
    const endHour = getRandomInt(23, 6);
    const endMinute = getRandomInt(59, 0);
    const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    const crossDay = startHour > endHour;
    const activityTimeRange = crossDay
      ? `${startTime}-次日${endTime}`
      : `${startTime}-${endTime}`;

    return {
      userName,
      earliestStartTime: startTime,
      latestStartTime: endTime,
      activityTimeRange,
      totalTasks: getRandomInt(80, 1),
      totalRuntime: getRandomInt(300000, 3000),
    };
  });

  return {
    users,
    totalUsers: users.length,
    refreshTime: new Date().toLocaleString('zh-CN'),
  };
};

export const generate24HourReport = () => {
  return {
    totalTasks: getRandomInt(200, 50),
    activeUsers: getRandomInt(30, 5),
    topProjects: projectNames.slice(0, 10).map((name) => ({
      projectName: name,
      totalTasks: getRandomInt(50, 1),
    })),
  };
};
