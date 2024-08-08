let routeConfig = {
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
  // @umijs/max-plugin-openapi
  // openAPI: [
  //   {
  //     requestLibPath: 'import { request } from "@umijs/max"',
  //     schemaPath: 'http://localhost:15090/v3/api-docs',
  //     projectName: 'group_center',
  //   },
  // ],
};

export default routeConfig;
