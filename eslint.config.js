import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'luisfernandeslu_frontend']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // On ESLint 9 core `no-unused-vars` does not count JSX references, so the
      // react plugin's jsx-uses-vars / jsx-uses-react rules are required.
      react.configs.flat.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    settings: { react: { version: 'detect' } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      // `_name` marks a deliberately discarded binding (destructuring rest).
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // HMR hint, not a correctness problem.
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['vite.config.js'],
    languageOptions: { globals: globals.node },
  },
]);
