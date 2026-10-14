import nextVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = [
  ...nextVitals,
  ...typescript,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off'
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort
    },
    ignores: ['node_modules', 'dist', '.next']
  }
];

export default eslintConfig;
