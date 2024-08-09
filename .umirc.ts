import { defineConfig } from '@umijs/max';

import childConfig from './config/config';

export default defineConfig({
  favicons: ['/favicon.ico'],
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
  ...childConfig,
  npmClient: 'pnpm',
  mako: {},
  tailwindcss: {},
});
