import { defineConfig } from '@rspack/cli';
import { CheckSyntaxRspackPlugin } from '../dist/index.js';

export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: ['web', 'es5'],
  devtool: 'source-map',
  plugins: [
    new CheckSyntaxRspackPlugin({
      ecmaVersion: 5,
    }),
  ],
});
