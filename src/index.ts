import type { RsbuildPlugin } from '@rsbuild/core';
import { CheckSyntaxPlugin } from './CheckSyntaxPlugin.js';
import type { CheckSyntaxOptions } from './types.js';

export type PluginCheckSyntaxOptions = CheckSyntaxOptions;

export const PLUGIN_CHECK_SYNTAX_NAME = 'rsbuild:check-syntax';

export function pluginCheckSyntax(
  options: PluginCheckSyntaxOptions = {},
): RsbuildPlugin {
  return {
    name: PLUGIN_CHECK_SYNTAX_NAME,

    setup(api) {
      api.modifyBundlerChain(async (chain, { isDev, target, environment }) => {
        if (isDev || target !== 'web') {
          return;
        }

        const { rootPath } = api.context;

        const targets = options.targets ?? environment.browserslist;

        chain.plugin(CheckSyntaxPlugin.name).use(CheckSyntaxPlugin, [
          {
            targets,
            rootPath,
            ...(typeof options === 'object' ? options : {}),
          },
        ]);
      });
    },
  };
}
