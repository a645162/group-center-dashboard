export default {
  proxy: {
    '/': {
      target: 'http://127.0.0.1:15090/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
