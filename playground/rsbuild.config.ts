import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginCheckSyntax } from '../src';

export default defineConfig({
  source: {
    exclude: [path.resolve(__dirname, './src/test.js')],
  },
  output: {
    sourceMap: {
      js: 'source-map',
    },
    overrideBrowserslist: ['ie 11'],
  },
  plugins: [pluginCheckSyntax()],
});
