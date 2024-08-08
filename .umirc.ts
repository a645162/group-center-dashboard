import { defineConfig } from '@umijs/max';

const getEnvBool = (key: string): boolean => {
  const value = process.env[key];

  if (value === undefined) {
    // Key is undefined
    return false;
  }

  return value.toString().toLowerCase().trim() === 'true';
};

const disableProxy = getEnvBool('DISABLE_PROXY');
const enableProxy = !disableProxy && getEnvBool('ENABLE_PROXY');
console.log('disableProxy', disableProxy);
console.log('enableProxy', enableProxy);
let proxyConfig = enableProxy
  ? {
      proxy: {
        '/api': {
          target: process.env.GROUP_CENTER_URL + '/api/',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
        '/web': {
          target: process.env.GROUP_CENTER_URL + '/web/',
          changeOrigin: true,
          pathRewrite: { '^/web': '' },
        },
        '/gpu': {
          target: process.env.GROUP_CENTER_URL + '/gpu/',
          changeOrigin: true,
          pathRewrite: { '^/gpu': '' },
        },
      },
    }
  : {};

export default defineConfig({
  favicons: ['/assets/favicon.ico'],
  // links: [{ rel: 'icon', href: '/assets/favicon.ico' }],
  plugins: ['@umijs/max-plugin-openapi'],
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Group Center',
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
  ...proxyConfig,
  npmClient: 'pnpm',
  mako: {},
  define: {
    'process.env.GROUP_CENTER_URL': process.env.GROUP_CENTER_URL,
  },
  tailwindcss: {},
});
