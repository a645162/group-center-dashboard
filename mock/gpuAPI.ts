import {
  generateGpuCountResponse,
  generateGpuTaskInfo,
  generateGpuUsageInfo,
} from './gpuApiFakeData';

export default {
  'GET /gpu/3090/gpu_count': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuCountResponse(1),
      errorCode: 0,
    });
  },
  'GET /gpu/3090/gpu_usage_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuUsageInfo('RTX 3090'),
      errorCode: 0,
    });
  },
  'GET /gpu/3090/gpu_task_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuTaskInfo(2),
      errorCode: 0,
    });
  },

  'GET /gpu/4090a/gpu_count': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuCountResponse(1),
      errorCode: 0,
    });
  },
  'GET /gpu/4090a/gpu_usage_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuUsageInfo('RTX 4090'),
      errorCode: 0,
    });
  },
  'GET /gpu/4090a/gpu_task_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuTaskInfo(4),
      errorCode: 0,
    });
  },

  'GET /gpu/4090b/gpu_count': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuCountResponse(1),
      errorCode: 0,
    });
  },
  'GET /gpu/4090b/gpu_usage_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuUsageInfo('RTX 4090'),
      errorCode: 0,
    });
  },
  'GET /gpu/4090b/gpu_task_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuTaskInfo(3),
      errorCode: 0,
    });
  },

  'GET /gpu/2084/gpu_count': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuCountResponse(4),
      errorCode: 0,
    });
  },
  'GET /gpu/2084/gpu_usage_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuUsageInfo('RTX 2080 Ti'),
      errorCode: 0,
    });
  },
  'GET /gpu/2084/gpu_task_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuTaskInfo(2),
      errorCode: 0,
    });
  },

  'GET /gpu/2082/gpu_count': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuCountResponse(2),
      errorCode: 0,
    });
  },
  'GET /gpu/2082/gpu_usage_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuUsageInfo('RTX 2080 Ti'),
      errorCode: 0,
    });
  },
  'GET /gpu/2082/gpu_task_info': (req: any, res: any) => {
    res.json({
      success: true,
      data: generateGpuTaskInfo(2),
      errorCode: 0,
    });
  },
};
