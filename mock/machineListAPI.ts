const machine_list = [
  {
    machineName: '3090',
    machineUrl: '/gpu/3090',
    position: '开发环境1',
    urlKeywords: ['/3090'],
  },
  {
    machineName: '4090A',
    machineUrl: '/gpu/4090a',
    position: '开发环境2',
    urlKeywords: ['/4090a'],
  },
  {
    machineName: '4090B',
    machineUrl: '/gpu/4090b',
    position: '开发环境2',
    urlKeywords: ['/4090b'],
  },
];

export default {
  'GET /web/open/front_end/machineList': (req: any, res: any) => {
    res.json({
      success: true,
      data: machine_list,
      errorCode: 0,
    });
  },
};
