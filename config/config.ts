import envConfig from './config.env';
import proxyConfig from './config.proxy';
import routeConfig from './config.route';

const childConfig = {
  ...routeConfig,
  ...proxyConfig,
  ...envConfig,
};

export default childConfig;
