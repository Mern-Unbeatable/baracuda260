import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import a11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
  // Base recommended rules
  js.configs.recommended,

  // Source files
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      tailwindcss: tailwindPlugin,
      'jsx-a11y': a11yPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        process: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      // react-hooks v5 uses 'recommended-latest' key for flat config
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      'react/react-in-jsx-scope': 'off', // Not required with new JSX transform
      'react/prop-types': 'off', // No PropTypes enforcement

      // Tailwind
      ...tailwindPlugin.configs['flat/recommended'].rules,

      // Accessibility
      ...a11yPlugin.flatConfigs.recommended.rules,

      // General quality
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Test files — add Jest globals
  {
    files: ['src/**/__tests__/**/*.{js,jsx}', 'src/**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': 'warn', // Relax in tests (e.g. destructured but unused mock vars)
    },
  },

  // Config / build files — CommonJS Node context
  {
    files: ['webpack.config.js', 'jest.config.js', 'postcss.config.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'script',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  // Public browser scripts (theme-init, etc.) — browser globals, plain script
  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-var': 'off',
    },
  },

  // Ignore generated output
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
