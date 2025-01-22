import color from 'picocolors';

import { type Logger, logger } from 'rslog';
import type { CheckSyntaxExclude } from './types.js';

export function checkIsExclude(
  path: string,
  exclude?: CheckSyntaxExclude,
): boolean {
  if (!exclude) {
    return false;
  }

  const excludes = Array.isArray(exclude) ? exclude : [exclude];

  // normalize to posix path
  const normalizedPath = path.replace(/\\/g, '/');

  return excludes.some((reg) => reg.test(normalizedPath));
}

export const isDebug = (): boolean => {
  if (!process.env.DEBUG) {
    return false;
  }

  const values = process.env.DEBUG.toLocaleLowerCase().split(',');
  return ['rsbuild', 'builder', '*'].some((key) => values.includes(key));
};

// setup the logger level
if (isDebug()) {
  logger.level = 'verbose';
}

function getTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

logger.override({
  debug: (message, ...args) => {
    if (logger.level !== 'verbose') {
      return;
    }
    const time = color.gray(`${getTime()}`);
    console.log(`  ${color.magenta('rsbuild')} ${time} ${message}`, ...args);
  },
});

export { logger };
export type { Logger };
