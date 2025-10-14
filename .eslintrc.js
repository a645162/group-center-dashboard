module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json', // 指向你的 tsconfig，让 ESLint 能够获得类型信息
  },
  extends: [
    require.resolve('@umijs/max/eslint'),
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:deprecation/recommended', // 引入 deprecation 的推荐配置
  ],
  plugins: ['deprecation'],
  rules: {
    // 你可以在这里定制规则级别
    // 推荐配置已经把 deprecation/deprecation 设为了 error（或你可以覆盖成 warn）
    'deprecation/deprecation': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'deprecation/deprecation': 'warn',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect', // 自动检测你项目中安装的 React 版本
    },
  },
};
