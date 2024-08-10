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
  {
    machineName: '4 x 2080Ti',
    machineUrl: '/gpu/2084',
    position: '测试环境1',
    urlKeywords: ['/2084'],
  },
  {
    machineName: '2 x 2080Ti',
    machineUrl: '/gpu/2082',
    position: '测试环境2',
    urlKeywords: ['/2082'],
  },
];

export default {
  'GET /web/open/front_end/publicMachineList': (req: any, res: any) => {
    res.json(machine_list);
  },
};
