import { defineConfig, globals, js, ts } from '@rslint/core';

export default defineConfig([
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: ['playground/src/**/*'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['playground/rsbuild.config.ts', 'playground/rspack.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: globals.rstest,
    },
  },
  {
    files: ['test/**/src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
