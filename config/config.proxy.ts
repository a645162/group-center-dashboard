import { getEnvBool } from './utils';

const disableProxy = getEnvBool('DISABLE_PROXY');
const enableProxy = getEnvBool('ENABLE_PROXY');
const finalResult = !disableProxy && enableProxy;

console.log('DISABLE_PROXY', disableProxy);
console.log('ENABLE_PROXY', enableProxy);
console.log('[Proxy]', finalResult);

let proxyConfig = finalResult
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
