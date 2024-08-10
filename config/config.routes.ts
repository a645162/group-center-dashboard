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
      icon: 'HomeOutlined',
    },
    {
      name: 'GPU看板',
      path: '/gpu-dashboard',
      component: './GpuDashboard',
      icon: 'PythonOutlined',
    },
    {
      name: '硬盘看板',
      path: '/disk-dashboard',
      component: './DiskDashboard',
      icon: 'DatabaseOutlined',
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
