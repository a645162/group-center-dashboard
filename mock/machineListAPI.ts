const machine_list = [
  {
    machineName: '3090-GPU1',
    machineUrl: '/gpu/3090-gpu1',
    position: '办公室',
    urlKeywords: ['/3090-gpu1'],
    isGpu: true,
  },
  {
    machineName: '4090-GPU1',
    machineUrl: '/gpu/4090-gpu1',
    position: '办公室',
    urlKeywords: ['/4090-gpu1'],
    isGpu: true,
  },
  {
    machineName: '4090-GPU2',
    machineUrl: '/gpu/4090-gpu2',
    position: '办公室',
    urlKeywords: ['/4090-gpu2'],
    isGpu: true,
  },
  {
    machineName: '4090A-4GPU',
    machineUrl: '/gpu/4090a',
    position: '学校机房',
    urlKeywords: ['/4090a'],
    isGpu: true,
  },
  {
    machineName: '4090B-4GPU',
    machineUrl: '/gpu/4090b',
    position: '学校机房',
    urlKeywords: ['/4090b'],
    isGpu: true,
  },
  {
    machineName: 'H100-01-8GPU',
    machineUrl: '/gpu/h100-01',
    position: '核心机房',
    urlKeywords: ['/h100-01'],
    isGpu: true,
  },
];

export default {
  'GET /web/open/front_end/publicMachineList': (req: any, res: any) => {
    res.json(machine_list);
  },
};
