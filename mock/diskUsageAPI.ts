import { generateDiskUsageData } from './FakeData/diskUsageFakeData';

export default {
  'GET /gpu/3090/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(1));
  },

  'GET /gpu/4090a/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(2));
  },

  'GET /gpu/4090b/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(1));
  },

  'GET /gpu/2084/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(1));
  },

  'GET /gpu/2082/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(1));
  },

  'GET /cpu/server/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(6));
  },
};
