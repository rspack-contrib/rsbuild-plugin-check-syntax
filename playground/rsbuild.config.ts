import { defineConfig } from '@rsbuild/core';
import { pluginCheckSyntax } from '../src';

export default defineConfig({
  plugins: [pluginCheckSyntax()],
});
