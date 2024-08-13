import { ceilAndTruncate, getRandomBool, getRandomInt } from './common';

const diskTemplate = {
  mountPoint: '/',
  usedPercentage: 82,
  usedStr: '354G',
  freeStr: '81G',
  totalStr: '457G',
  triggerHighPercentageUsed: false,
  triggerLowFreeBytes: false,
  triggerSizeWarning: false,
  type: 'HDD',
  purpose: '数据盘',
};

const generateDiskUsage = (mountPoint: string, isSSD: boolean = false) => {
  const usagePercentage = getRandomInt(0, 100);
  const usageRatio = usagePercentage / 100;

  // Clone Template
  // let data = diskTemplate;
  let data = { ...diskTemplate };

  data.mountPoint = mountPoint;

  const totalTB = getRandomInt(1, 4);
  let totalGB = totalTB * 1024;
  if (isSSD) {
    totalGB = totalTB * 900;
    data.type = 'SSD';
    data.purpose = '系统盘';
  }
  const usageGB = totalGB * usageRatio;
  const freeGB = totalGB - usageGB;

  const totalStr = ceilAndTruncate(totalGB) + 'G';
  const usedStr = ceilAndTruncate(usageGB) + 'G';
  const freeStr = ceilAndTruncate(freeGB) + 'G';

  data.usedPercentage = usagePercentage;
  data.totalStr = totalStr;
  data.usedStr = usedStr;
  data.freeStr = freeStr;

  data.triggerHighPercentageUsed = getRandomBool();
  data.triggerLowFreeBytes = getRandomBool();
  data.triggerSizeWarning = getRandomBool();

  return data;
};

export const generateDiskUsageData = (count: number) => {
  let diskUsageList = [];

  diskUsageList.push(generateDiskUsage('/', true));

  for (let i = 1; i <= count; i++) {
    diskUsageList.push(generateDiskUsage('/mnt/hdd' + i));
  }

  return {
    result: diskUsageList.length,
    diskUsage: diskUsageList,
  };
};
