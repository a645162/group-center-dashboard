module.exports = {
  extends: require.resolve('@umijs/max/stylelint'),
  rules: {
    'property-no-vendor-prefix': null, // 禁用vendor prefix检查
  },
};
