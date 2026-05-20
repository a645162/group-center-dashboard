import {
  generate24HourReport,
  generateGpuStats,
  generateProjectStats,
  generateTimeTrendData,
  generateUserActivityTimeData,
  generateUserStats,
} from './FakeData/statisticsFakeData';

const wrapResponse = (data: any) => ({
  isSucceed: true,
  result: data,
});

export default {
  'GET /web/dashboard/statistics/gpus': (req: any, res: any) => {
    res.json(wrapResponse(generateGpuStats()));
  },

  'GET /web/dashboard/statistics/users': (req: any, res: any) => {
    res.json(wrapResponse(generateUserStats()));
  },

  'GET /web/dashboard/statistics/projects': (req: any, res: any) => {
    res.json(wrapResponse(generateProjectStats()));
  },

  'GET /web/dashboard/statistics/time-trend': (req: any, res: any) => {
    const timePeriod = req.query?.timePeriod || 'ONE_WEEK';
    res.json(wrapResponse(generateTimeTrendData(timePeriod)));
  },

  'GET /web/dashboard/statistics/user-activity-time-distribution': (
    req: any,
    res: any,
  ) => {
    res.json(wrapResponse(generateUserActivityTimeData()));
  },

  'GET /web/dashboard/statistics/reports/24hour': (req: any, res: any) => {
    res.json(wrapResponse(generate24HourReport()));
  },
};
