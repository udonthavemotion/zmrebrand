/**
 * Cache Busting Utility
 * Generates cache-busting parameters for static assets
 */

// Generate a build-time timestamp for consistent cache busting
const BUILD_TIME = Date.now();

/**
 * Add cache-busting parameter to asset URLs
 * @param url - The asset URL
 * @param version - Optional custom version, defaults to build time
 * @returns URL with cache-busting parameter
 */
export function bustCache(url: string, version?: string | number): string {
  const cacheVersion = version || BUILD_TIME;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${cacheVersion}`;
}

/**
 * Get the current cache version
 * @returns The cache version timestamp
 */
export function getCacheVersion(): number {
  return BUILD_TIME;
}

/**
 * Bust cache for multiple URLs
 * @param urls - Array of URLs to bust cache for
 * @param version - Optional custom version
 * @returns Array of URLs with cache-busting parameters
 */
export function bustCacheMultiple(urls: string[], version?: string | number): string[] {
  return urls.map(url => bustCache(url, version));
}

// Export for global use
export default {
  bustCache,
  getCacheVersion,
  bustCacheMultiple,
  BUILD_TIME
};
