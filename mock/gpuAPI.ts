import {
  generateGpuCountResponse,
  generateGpuUsageInfo,
  generateTaskInfoResponse,
} from './FakeData/gpuApiFakeData';

export default {
  'GET /gpu/3090-gpu1/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(1));
  },
  'GET /gpu/3090-gpu1/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 3090'));
  },
  'GET /gpu/3090-gpu1/gpu_task_info': (req: any, res: any) => {
    res.json(generateTaskInfoResponse(1));
  },

  'GET /gpu/4090-gpu1/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(1));
  },
  'GET /gpu/4090-gpu1/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 4090'));
  },
  'GET /gpu/4090-gpu1/gpu_task_info': (req: any, res: any) => {
    res.json(generateTaskInfoResponse(2));
  },

  'GET /gpu/4090-gpu2/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(1));
  },
  'GET /gpu/4090-gpu2/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 4090'));
  },
  'GET /gpu/4090-gpu2/gpu_task_info': (req: any, res: any) => {
    res.json(generateTaskInfoResponse(3));
  },

  'GET /gpu/4090a/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(4));
  },
  'GET /gpu/4090a/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 4090'));
  },
  'GET /gpu/4090a/gpu_task_info': (req: any, res: any) => {
    res.json(generateTaskInfoResponse(2));
  },

  'GET /gpu/4090b/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(4));
  },
  'GET /gpu/4090b/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('RTX 4090'));
  },
  'GET /gpu/4090b/gpu_task_info': (req: any, res: any) => {
    res.json(generateTaskInfoResponse(4));
  },

  'GET /gpu/h100-01/gpu_count': (req: any, res: any) => {
    res.json(generateGpuCountResponse(8));
  },
  'GET /gpu/h100-01/gpu_usage_info': (req: any, res: any) => {
    res.json(generateGpuUsageInfo('H100-SXM'));
  },
  'GET /gpu/h100-01/gpu_task_info': (req: any, res: any) => {
    res.json(generateTaskInfoResponse(2));
  },
};
