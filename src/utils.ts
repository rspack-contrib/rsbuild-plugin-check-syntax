import type { CheckSyntaxExclude } from './types.js';

export const isExcluded = (input: string, exclude?: CheckSyntaxExclude) => {
  if (!exclude) {
    return false;
  }
  const excludes = Array.isArray(exclude) ? exclude : [exclude];
  return excludes.some((reg) => reg.test(input));
};

export function isPathExcluded(
  path: string,
  exclude?: CheckSyntaxExclude,
): boolean {
  // normalize to posix path
  const normalizedPath = path.replace(/\\/g, '/');
  return isExcluded(normalizedPath, exclude);
}
