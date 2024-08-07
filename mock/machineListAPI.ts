const machine_list = [
  {
    machineName: '3090',
    machineUrl: '/gpu/3090',
    position: '开发环境',
    urlKeywords: ['/3090'],
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
