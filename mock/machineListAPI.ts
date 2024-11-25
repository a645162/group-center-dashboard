const machine_list = [
  {
    machineName: 'Server',
    machineUrl: '/cpu/server',
    position: '核心机房',
    urlKeywords: ['/server'],
    isGpu: false,
  },
  {
    machineName: 'NAS',
    machineUrl: '/cpu/nas',
    position: '存储机房',
    urlKeywords: ['/nas'],
    isGpu: false,
  },
  {
    machineName: '3090',
    machineUrl: '/gpu/3090',
    position: '办公室',
    urlKeywords: ['/3090'],
    isGpu: true,
  },
  {
    machineName: '4090A',
    machineUrl: '/gpu/4090a',
    position: '办公室',
    urlKeywords: ['/4090a'],
    isGpu: true,
  },
  {
    machineName: '4090B',
    machineUrl: '/gpu/4090b',
    position: '办公室',
    urlKeywords: ['/4090b'],
    isGpu: true,
  },
  {
    machineName: '4 x 2080Ti',
    machineUrl: '/gpu/2084',
    position: '公共实验室',
    urlKeywords: ['/2084'],
    isGpu: true,
  },
  {
    machineName: '2 x 2080Ti',
    machineUrl: '/gpu/2082',
    position: '公共实验室',
    urlKeywords: ['/2082'],
    isGpu: true,
  },
  {
    machineName: '8 x RTX 4090 A',
    machineUrl: '/gpu/4098a',
    position: '学校机房',
    urlKeywords: ['/4098a'],
    isGpu: true,
  },
  {
    machineName: '8 x RTX 4090 B',
    machineUrl: '/gpu/4098a',
    position: '学校机房',
    urlKeywords: ['/4098a'],
    isGpu: true,
  },
];

export default {
  'GET /web/open/front_end/publicMachineList': (req: any, res: any) => {
    res.json(machine_list);
  },
};
