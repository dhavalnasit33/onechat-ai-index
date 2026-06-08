/**
 * Returns the Next.js basePath for use in client-side fetch() calls.
 * <Link> and router.push() handle basePath automatically,
 * but raw fetch('/api/...') does NOT — it needs the prefix.
 */
export const basePath = '/ai-behavior-index';

/**
 * Prepend basePath to an API path for use in fetch().
 * Usage: fetch(apiUrl('/api/admin/topics'))
 */
export function apiUrl(path: string): string {
  return `${basePath}${path}`;
}
