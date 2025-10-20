import type { CheckSyntaxExclude } from './types.js';

export const isExcluded = (input: string, exclude?: CheckSyntaxExclude) => {
  if (!exclude) {
    return false;
  }

  const excludes = Array.isArray(exclude) ? exclude : [exclude];

  return excludes.some((condition) => {
    if (typeof condition === 'function') {
      return condition(input);
    }
    if (typeof condition === 'string') {
      return input.startsWith(condition);
    }
    return condition.test(input);
  });
};

export function isPathExcluded(
  path: string,
  exclude?: CheckSyntaxExclude,
): boolean {
  // normalize to posix path
  const normalizedPath = path.replace(/\\/g, '/');
  return isExcluded(normalizedPath, exclude);
}
