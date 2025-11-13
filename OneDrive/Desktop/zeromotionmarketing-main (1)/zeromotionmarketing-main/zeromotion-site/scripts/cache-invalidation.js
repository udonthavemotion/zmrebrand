#!/usr/bin/env node

/**
 * Cache Invalidation Script for ZeroMotion Marketing
 * Handles cache clearing and invalidation during deployments
 */

const fs = require('fs');
const path = require('path');

class CacheInvalidator {
  constructor() {
    this.manifestPath = path.join(__dirname, '..', 'public', 'cache-manifest.json');
    this.swPath = path.join(__dirname, '..', 'public', 'sw.js');
    this.vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
  }

  /**
   * Update cache version in manifest and service worker
   */
  async updateCacheVersion(newVersion) {
    try {
      // Update manifest version
      const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
      manifest.version = newVersion;
      manifest.timestamp = new Date().toISOString();

      fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`✅ Updated cache manifest version to ${newVersion}`);

      // Update service worker version
      let swContent = fs.readFileSync(this.swPath, 'utf8');
      const versionRegex = /const CACHE_NAME = ['"]([^'"]+)['"]/;
      const newCacheName = `zeromotion-v${newVersion.replace(/\./g, '')}`;

      swContent = swContent.replace(versionRegex, `const CACHE_NAME = '${newCacheName}'`);
      fs.writeFileSync(this.swPath, swContent);
      console.log(`✅ Updated service worker cache name to ${newCacheName}`);

      return true;
    } catch (error) {
      console.error('❌ Failed to update cache version:', error);
      return false;
    }
  }

  /**
   * Clear specific cache types
   */
  async clearCacheTypes(types = []) {
    const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
    const cacheTypes = types.length > 0 ? types : Object.keys(manifest.cacheStrategy);

    console.log(`🧹 Clearing cache types: ${cacheTypes.join(', ')}`);

    // In a real deployment, this would integrate with CDN APIs
    // For now, we'll just log what would be cleared
    cacheTypes.forEach(type => {
      console.log(`  - Clearing ${type} cache`);
    });

    return true;
  }

  /**
   * Generate cache headers for deployment
   */
  async generateCacheHeaders() {
    const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
    const headers = {};

    // Generate headers based on cache strategy
    Object.entries(manifest.cacheStrategy).forEach(([type, strategy]) => {
      const duration = manifest.cacheDuration[type];

      switch (strategy) {
        case 'cache-first':
          headers[type] = `public, max-age=${duration}, immutable`;
          break;
        case 'network-first':
          headers[type] = `public, max-age=0, s-maxage=${duration}, stale-while-revalidate=${duration}`;
          break;
        case 'stale-while-revalidate':
          headers[type] = `public, max-age=${duration}, stale-while-revalidate=${duration}`;
          break;
        case 'network-only':
          headers[type] = 'public, max-age=0, no-cache';
          break;
      }
    });

    console.log('📋 Generated cache headers:');
    console.log(JSON.stringify(headers, null, 2));

    return headers;
  }

  /**
   * Validate cache configuration
   */
  async validateCacheConfig() {
    try {
      const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
      const swContent = fs.readFileSync(this.swPath, 'utf8');

      // Validate manifest structure
      const requiredFields = ['version', 'assets', 'cacheStrategy', 'cacheDuration'];
      const missingFields = requiredFields.filter(field => !manifest[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields in manifest: ${missingFields.join(', ')}`);
      }

      // Validate service worker version matches manifest
      const manifestVersion = manifest.version.replace(/\./g, '');
      const swVersionMatch = swContent.match(/const CACHE_NAME = ['"]([^'"]+)['"]/);

      if (!swVersionMatch) {
        throw new Error('Could not find CACHE_NAME in service worker');
      }

      const swVersion = swVersionMatch[1].replace('zeromotion-v', '');

      if (swVersion !== manifestVersion) {
        throw new Error(`Version mismatch: manifest=${manifestVersion}, service worker=${swVersion}`);
      }

      console.log('✅ Cache configuration is valid');
      return true;
    } catch (error) {
      console.error('❌ Cache configuration validation failed:', error.message);
      return false;
    }
  }

  /**
   * Run deployment cache invalidation
   */
  async runDeploymentInvalidation(options = {}) {
    const {
      newVersion,
      clearTypes = [],
      skipValidation = false
    } = options;

    console.log('🚀 Starting cache invalidation for deployment...');

    if (!skipValidation && !(await this.validateCacheConfig())) {
      return false;
    }

    if (newVersion) {
      await this.updateCacheVersion(newVersion);
    }

    if (clearTypes.length > 0) {
      await this.clearCacheTypes(clearTypes);
    }

    await this.generateCacheHeaders();

    console.log('✅ Cache invalidation completed successfully');
    return true;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const invalidator = new CacheInvalidator();

  switch (command) {
    case 'update-version':
      const newVersion = args[1];
      if (!newVersion) {
        console.error('Usage: node cache-invalidation.js update-version <version>');
        process.exit(1);
      }
      invalidator.updateCacheVersion(newVersion);
      break;

    case 'clear-cache':
      const types = args.slice(1);
      invalidator.clearCacheTypes(types);
      break;

    case 'validate':
      invalidator.validateCacheConfig();
      break;

    case 'deploy':
      const version = args[1];
      const clearTypes = args.slice(2);
      invalidator.runDeploymentInvalidation({
        newVersion: version,
        clearTypes
      });
      break;

    case 'headers':
      invalidator.generateCacheHeaders();
      break;

    default:
      console.log(`
Cache Invalidation Tool for ZeroMotion Marketing

Usage:
  node cache-invalidation.js <command> [options]

Commands:
  update-version <version>    Update cache version in manifest and service worker
  clear-cache [types...]      Clear specific cache types
  validate                    Validate cache configuration
  deploy <version> [types...] Run full deployment invalidation
  headers                     Generate cache headers for deployment

Examples:
  node cache-invalidation.js update-version 2.2.0
  node cache-invalidation.js clear-cache static critical
  node cache-invalidation.js deploy 2.2.0 static fonts
  node cache-invalidation.js validate
      `);
      break;
  }
}

module.exports = CacheInvalidator;
