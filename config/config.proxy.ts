import { getEnvBool } from './utils';

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

export default proxyConfig;
