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
