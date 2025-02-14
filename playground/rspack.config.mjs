import { defineConfig } from '@rspack/cli';
import { CheckSyntaxRspackPlugin } from '../dist/index.js';

export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'source-map',
  plugins: [
    new CheckSyntaxRspackPlugin({
      ecmaVersion: 5,
    }),
  ],
});
