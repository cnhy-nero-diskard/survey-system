import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'client/build/**',
      'client/src/**/.trash/**',
      'client/src copy/**',
      'server/localization_queries/**',
      'server/db/schema/**',
      'coverage/**',
      'openspec/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['server/**/*.js', 'client/scripts/**/*.mjs', 'client/*.mjs', '*.mjs', '*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  {
    files: ['client/src/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        // Injected at build time by react-scripts (webpack DefinePlugin), not a real
        // browser global, so it needs declaring explicitly here.
        process: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // Stylistic / needs a human look, not a build-breaking defect - see CONTRIBUTING.md
      'react/no-unescaped-entities': 'warn',
      'react/display-name': 'warn',
      'no-prototype-builtins': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-empty-pattern': 'warn',
    },
  },
  {
    files: ['**/*.test.js', '**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    // Puppeteer script: page.evaluateOnNewDocument() callbacks run in a browser
    // context even though the outer file is a Node script.
    files: ['client/screenshot.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  prettierConfig,
];
