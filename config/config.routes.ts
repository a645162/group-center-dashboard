let routesConfig = {
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: 'GPU看板',
      path: '/gpu-dashboard',
      component: './GpuDashboard',
    },
    {
      name: '硬盘看板',
      path: '/disk-dashboard',
      component: './DiskDashboard',
    },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
  ],
};

export default routesConfig;
