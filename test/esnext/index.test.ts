import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild, loadConfig } from '@rsbuild/core';
import { pluginCheckSyntax } from '../../dist';
import { normalizeToPosixPath, proxyConsole } from '../helper';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('should throw error when using optional chaining and target is es6 browsers', async () => {
  const { logs, restore } = proxyConsole();

  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      ...(await loadConfig({ cwd: __dirname })).content,
      plugins: [
        pluginCheckSyntax({
          targets: ['chrome >= 53'],
        }),
      ],
    },
  });

  await expect(rsbuild.build()).rejects.toThrowError(
    '[@rsbuild/plugin-check-syntax]',
  );

  restore();

  expect(logs.find((log) => log.includes('ERROR 1'))).toBeTruthy();
  expect(
    logs.find((log) => log.includes('source:') && log.includes('src/test.js')),
  ).toBeTruthy();
  expect(
    logs.find(
      (log) =>
        log.includes('output:') &&
        normalizeToPosixPath(log).includes('/dist/static/js/index'),
    ),
  ).toBeTruthy();
  expect(
    logs.find(
      (log) => log.includes('reason:') && log.includes('Unexpected token'),
    ),
  ).toBeTruthy();
  expect(
    logs.find((log) => log.includes('> 3 |   console.log(arr, arr?.flat());')),
  ).toBeTruthy();
});

test('should throw error when using optional chaining and target is fully supports es6-module', async () => {
  const { logs, restore } = proxyConsole();

  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      ...(await loadConfig({ cwd: __dirname })).content,
      plugins: [
        pluginCheckSyntax({
          targets: ['fully supports es6-module'],
        }),
      ],
    },
  });

  await expect(rsbuild.build()).rejects.toThrowError(
    '[@rsbuild/plugin-check-syntax]',
  );

  restore();

  expect(logs.find((log) => log.includes('ERROR 1'))).toBeTruthy();
  expect(
    logs.find((log) => log.includes('source:') && log.includes('src/test.js')),
  ).toBeTruthy();
  expect(
    logs.find(
      (log) =>
        log.includes('output:') &&
        normalizeToPosixPath(log).includes('/dist/static/js/index'),
    ),
  ).toBeTruthy();
  expect(
    logs.find(
      (log) => log.includes('reason:') && log.includes('Unexpected token'),
    ),
  ).toBeTruthy();
  expect(
    logs.find((log) => log.includes('> 3 |   console.log(arr, arr?.flat());')),
  ).toBeTruthy();
});

test('should not throw error when using optional chaining and ecmaVersion is 2020', async () => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      ...(await loadConfig({ cwd: __dirname })).content,
      plugins: [
        pluginCheckSyntax({
          ecmaVersion: 2020,
        }),
      ],
    },
  });

  await expect(rsbuild.build()).resolves.toBeTruthy();
});

test('verifies that the plugin throws an error for optional chaining with ES6 targets, and that output and reason details are not included in the error message.', async () => {
  const { logs, restore } = proxyConsole();

  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      ...(await loadConfig({ cwd: __dirname })).content,
      plugins: [
        pluginCheckSyntax({
          targets: ['chrome >= 53'],
          excludeErrorLogs: ['source', 'output', 'reason', 'code'],
        }),
      ],
    },
  });

  await expect(rsbuild.build()).rejects.toThrowError(
    '[@rsbuild/plugin-check-syntax]',
  );

  restore();

  expect(logs.find((log) => log.includes('ERROR 1'))).toBeTruthy();
  expect(logs.find((log) => log.includes('source:'))).toBeFalsy();
  expect(logs.find((log) => log.includes('output:'))).toBeFalsy();
  expect(logs.find((log) => log.includes('reason:'))).toBeFalsy();
  expect(
    logs.find((log) => log.includes('> 3 |   console.log(arr, arr?.flat());')),
  ).toBeFalsy();
});
