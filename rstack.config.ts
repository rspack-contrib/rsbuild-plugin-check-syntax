// Configuration guide: https://rstack.rs/config
import { define } from 'rstack';

define.lib({
  lib: [{ syntax: 'es2023', dts: true }],
});

define.test({
  env: {
    NO_COLOR: 'true',
  },
});

define.fmt({
  singleQuote: true,
  ignorePatterns: ['dist'],
});

define.staged({
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': ['rs lint', 'rs fmt'],
  '*.{json,md,mdx,css,scss,less,html,yml,yaml}': 'rs fmt',
});

define.lint(({ globals, js, ts }) => [
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: ['playground/src/**/*', 'test/**/src/**/*.{js,jsx}'],
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
]);
