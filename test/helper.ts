import path from 'node:path';
import upath from 'upath';

export const proxyConsole = (
  types: string[] = ['log', 'warn', 'info', 'error'],
) => {
  const logs: string[] = [];
  const restores: Array<() => void> = [];

  for (const type of types) {
    const method = console[type];

    restores.push(() => {
      console[type] = method;
    });

    console[type] = (log) => {
      logs.push(log);
    };
  }

  return {
    logs,
    restore: () => {
      for (const restore of restores) {
        restore();
      }
    },
  };
};

export const normalizeToPosixPath = (p: string | undefined) =>
  upath
    .normalizeSafe(path.normalize(p || ''))
    .replace(/^([a-zA-Z]+):/, (_, m: string) => `/${m.toLowerCase()}`);
