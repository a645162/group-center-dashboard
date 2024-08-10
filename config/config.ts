import envConfig from './config.env';
import openApiConfig from './config.openapi';
import proxyConfig from './config.proxy';
import routesConfig from './config.routes';

const childConfig = {
  ...routesConfig,
  ...openApiConfig,
  ...proxyConfig,
  ...envConfig,
};

export default childConfig;
