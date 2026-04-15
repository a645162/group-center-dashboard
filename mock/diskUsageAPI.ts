import { generateDiskUsageData } from './FakeData/diskUsageFakeData';

export default {
  'GET /gpu/3090-gpu1/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(2));
  },
  'GET /gpu/4090-gpu1/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(2));
  },
  'GET /gpu/4090-gpu2/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(2));
  },
  'GET /gpu/4090a/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(3));
  },
  'GET /gpu/4090b/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(3));
  },
  'GET /gpu/h100-01/disk_usage': (req: any, res: any) => {
    res.json(generateDiskUsageData(4));
  },
};
