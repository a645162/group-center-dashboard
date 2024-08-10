import {
  generateGpuCountResponse,
  generateGpuTaskInfo,
  generateGpuUsageInfo,
} from './FakeData/gpuApiFakeData';

export default {
  'GET /gpu/3090/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(1));
  },
  'GET /gpu/3090/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 3090'));
  },
  'GET /gpu/3090/gpu_task_info': (req: any, res: any) => {
    res.json(generateGpuTaskInfo(2));
  },

  'GET /gpu/4090a/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(1));
  },
  'GET /gpu/4090a/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 4090'));
  },
  'GET /gpu/4090a/gpu_task_info': (req: any, res: any) => {
    res.json(generateGpuTaskInfo(4));
  },

  'GET /gpu/4090b/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(1));
  },
  'GET /gpu/4090b/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 4090'));
  },
  'GET /gpu/4090b/gpu_task_info': (req: any, res: any) => {
    res.json(generateGpuTaskInfo(3));
  },

  'GET /gpu/2084/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(4));
  },
  'GET /gpu/2084/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 2080 Ti'));
  },
  'GET /gpu/2084/gpu_task_info': (req: any, res: any) => {
    res.json(generateGpuTaskInfo(2));
  },

  'GET /gpu/2082/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(2));
  },
  'GET /gpu/2082/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 2080 Ti'));
  },
  'GET /gpu/2082/gpu_task_info': (req: any, res: any) => {
    res.json(generateGpuTaskInfo(2));
  },
};
