import type { CheckSyntaxExclude } from './types.js';

export const isExcluded = (input: string, exclude?: CheckSyntaxExclude) => {
  if (!exclude) {
    return false;
  }

  const excludes = Array.isArray(exclude) ? exclude : [exclude];
  // normalize to posix path for RegExp
  const normalizedPath = input.replace(/\\/g, '/');

  return excludes.some((condition) => {
    if (typeof condition === 'function') {
      return condition(input);
    }
    if (typeof condition === 'string') {
      return input.startsWith(condition);
    }
    return condition.test(normalizedPath);
  });
};
