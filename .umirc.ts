import { defineConfig } from '@umijs/max';

export default defineConfig({
  plugins: ['@umijs/max-plugin-openapi'],
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
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
      name: 'GPU',
      path: '/gpu',
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
  npmClient: 'pnpm',
  mako: {},
  define: {
    'process.env.GROUP_CENTER_URL': process.env.GROUP_CENTER_URL,
  },
  tailwindcss: {},
});
