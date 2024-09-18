import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#configuration

export default [
  {
    ignores: [
      '*.js',
      '**/.husky/',
      '**/.idea/',
      '**/Doc/',
      '**/Resource/',
      '**/dist/',
      'src/.umi/',
      'src/.umi-production/',
    ],
  },
  ...compat.extends('eslint:recommended', 'plugin:react/recommended'),
];
