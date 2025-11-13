#!/usr/bin/env node

/**
 * Cache Testing Script for ZeroMotion Marketing
 * Tests caching implementation with curl and Lighthouse
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CacheTester {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'https://zeromotion.marketing';
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const coloredMessage = this.colorize(message, type);
    console.log(`[${timestamp}] ${coloredMessage}`);
  }

  colorize(message, type) {
    const colors = {
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m',
      info: '\x1b[36m',
      reset: '\x1b[0m'
    };

    return `${colors[type]}${message}${colors.reset}`;
  }

  async runCurlTest(url, expectedHeaders = {}) {
    const testName = `Curl test: ${url}`;
    this.log(`Running ${testName}`, 'info');

    try {
      const command = `curl -s -I -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${url}"`;
      const output = execSync(command, { encoding: 'utf8' });

      const headers = this.parseCurlHeaders(output);
      let passed = true;
      const failures = [];

      // Check expected headers
      for (const [headerName, expectedValue] of Object.entries(expectedHeaders)) {
        const actualValue = headers[headerName.toLowerCase()];

        if (!actualValue) {
          passed = false;
          failures.push(`Missing header: ${headerName}`);
        } else if (expectedValue && !actualValue.includes(expectedValue)) {
          passed = false;
          failures.push(`Header ${headerName}: expected "${expectedValue}", got "${actualValue}"`);
        }
      }

      if (passed) {
        this.results.passed++;
        this.log(`✅ ${testName} PASSED`, 'success');
      } else {
        this.results.failed++;
        this.log(`❌ ${testName} FAILED`, 'error');
        failures.forEach(failure => this.log(`   ${failure}`, 'error'));
      }

      this.results.tests.push({
        name: testName,
        passed,
        failures,
        headers
      });

      return { passed, headers };
    } catch (error) {
      this.results.failed++;
      this.log(`❌ ${testName} ERROR: ${error.message}`, 'error');
      this.results.tests.push({
        name: testName,
        passed: false,
        failures: [error.message],
        headers: null
      });
      return { passed: false, headers: null };
    }
  }

  parseCurlHeaders(output) {
    const headers = {};
    const lines = output.split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const headerName = line.substring(0, colonIndex).trim().toLowerCase();
        const headerValue = line.substring(colonIndex + 1).trim();
        headers[headerName] = headerValue;
      }
    }

    return headers;
  }

  async testStaticAssetCaching() {
    this.log('Testing static asset caching...', 'info');

    const testCases = [
      {
        url: `${this.baseUrl}/_astro/global.css`,
        expected: {
          'cache-control': 'max-age=31536000, immutable',
          'cdn-cache-control': 'max-age=31536000'
        }
      },
      {
        url: `${this.baseUrl}/assets/main.js`,
        expected: {
          'cache-control': 'max-age=31536000, immutable'
        }
      },
      {
        url: `${this.baseUrl}/favico/android-chrome-512x512.png`,
        expected: {
          'cache-control': 'max-age=31536000, immutable'
        }
      }
    ];

    for (const testCase of testCases) {
      await this.runCurlTest(testCase.url, testCase.expected);
    }
  }

  async testPageCaching() {
    this.log('Testing page caching...', 'info');

    const testCases = [
      {
        url: `${this.baseUrl}/`,
        expected: {
          'cache-control': 'max-age=0, s-maxage=86400, stale-while-revalidate=86400'
        }
      },
      {
        url: `${this.baseUrl}/pricing`,
        expected: {
          'cache-control': 'max-age=0, s-maxage=86400, stale-while-revalidate=86400'
        }
      }
    ];

    for (const testCase of testCases) {
      await this.runCurlTest(testCase.url, testCase.expected);
    }
  }

  async testAnalyticsBypass() {
    this.log('Testing analytics cache bypass...', 'info');

    const testCases = [
      {
        url: `https://www.googletagmanager.com/gtm.js`,
        expected: {
          'cache-control': 'no-cache'
        }
      },
      {
        url: `https://www.google-analytics.com/analytics.js`,
        expected: {
          'cache-control': 'no-cache'
        }
      }
    ];

    for (const testCase of testCases) {
      await this.runCurlTest(testCase.url, testCase.expected);
    }
  }

  async testCompression() {
    this.log('Testing compression...', 'info');

    const testCases = [
      {
        url: `${this.baseUrl}/`,
        expected: {
          'content-encoding': 'gzip',
          'vary': 'Accept-Encoding'
        }
      },
      {
        url: `${this.baseUrl}/_astro/global.css`,
        expected: {
          'content-encoding': 'gzip'
        }
      }
    ];

    for (const testCase of testCases) {
      await this.runCurlTest(testCase.url, testCase.expected);
    }
  }

  async testServiceWorker() {
    this.log('Testing service worker...', 'info');

    const swUrl = `${this.baseUrl}/sw.js`;
    const result = await this.runCurlTest(swUrl, {
      'cache-control': 'public, max-age=0, must-revalidate',
      'service-worker-allowed': '/'
    });

    return result;
  }

  async runLighthouseTest() {
    this.log('Running Lighthouse performance test...', 'info');

    try {
      const command = `lighthouse ${this.baseUrl} --output=json --output-path=lighthouse-cache-report.json --chrome-flags="--headless" --only-categories=performance`;
      execSync(command, { stdio: 'inherit' });

      // Read and analyze results
      const reportPath = path.join(process.cwd(), 'lighthouse-cache-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        const score = report.categories.performance.score * 100;

        this.log(`Lighthouse Performance Score: ${score}/100`, score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error');

        // Check specific caching audits
        const audits = report.audits;

        if (audits['uses-long-cache-ttl']) {
          const cacheScore = audits['uses-long-cache-ttl'].score;
          this.log(`Cache TTL Score: ${cacheScore}`, cacheScore >= 0.9 ? 'success' : 'warning');
        }

        if (audits['uses-text-compression']) {
          const compressionScore = audits['uses-text-compression'].score;
          this.log(`Text Compression Score: ${compressionScore}`, compressionScore >= 0.9 ? 'success' : 'warning');
        }
      }

      this.results.passed++;
      this.results.tests.push({
        name: 'Lighthouse Performance Test',
        passed: true,
        failures: [],
        score: report?.categories?.performance?.score * 100 || 0
      });

    } catch (error) {
      this.results.failed++;
      this.log(`❌ Lighthouse test failed: ${error.message}`, 'error');
      this.results.tests.push({
        name: 'Lighthouse Performance Test',
        passed: false,
        failures: [error.message],
        score: 0
      });
    }
  }

  async runCacheInvalidationTest() {
    this.log('Testing cache invalidation...', 'info');

    try {
      // Test cache invalidation script
      const invalidationScript = path.join(__dirname, 'cache-invalidation.js');
      const command = `node ${invalidationScript} validate`;

      execSync(command, { stdio: 'pipe' });

      this.results.passed++;
      this.log('✅ Cache invalidation validation PASSED', 'success');
      this.results.tests.push({
        name: 'Cache Invalidation Test',
        passed: true,
        failures: []
      });

    } catch (error) {
      this.results.failed++;
      this.log(`❌ Cache invalidation test failed: ${error.message}`, 'error');
      this.results.tests.push({
        name: 'Cache Invalidation Test',
        passed: false,
        failures: [error.message]
      });
    }
  }

  generateReport() {
    const report = {
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        successRate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`
      },
      tests: this.results.tests,
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl
    };

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'cache-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`\n📊 Cache Testing Report Generated`, 'info');
    this.log(`   Total Tests: ${report.summary.total}`, 'info');
    this.log(`   Passed: ${report.summary.passed}`, 'success');
    this.log(`   Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'info');
    this.log(`   Success Rate: ${report.summary.successRate}`, report.summary.successRate === '100%' ? 'success' : 'warning');
    this.log(`   Report saved to: ${reportPath}`, 'info');

    return report;
  }

  async runAllTests() {
    this.log('🚀 Starting comprehensive cache testing suite...', 'info');
    this.log(`Base URL: ${this.baseUrl}`, 'info');

    try {
      // Test static assets
      await this.testStaticAssetCaching();

      // Test page caching
      await this.testPageCaching();

      // Test analytics bypass
      await this.testAnalyticsBypass();

      // Test compression
      await this.testCompression();

      // Test service worker
      await this.testServiceWorker();

      // Test cache invalidation
      await this.runCacheInvalidationTest();

      // Run Lighthouse (optional, requires lighthouse to be installed)
      if (process.env.RUN_LIGHTHOUSE === 'true') {
        await this.runLighthouseTest();
      }

    } catch (error) {
      this.log(`❌ Test suite failed: ${error.message}`, 'error');
    }

    return this.generateReport();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const tester = new CacheTester();

  switch (command) {
    case 'static':
      tester.testStaticAssetCaching().then(() => tester.generateReport());
      break;

    case 'pages':
      tester.testPageCaching().then(() => tester.generateReport());
      break;

    case 'analytics':
      tester.testAnalyticsBypass().then(() => tester.generateReport());
      break;

    case 'compression':
      tester.testCompression().then(() => tester.generateReport());
      break;

    case 'sw':
      tester.testServiceWorker().then(() => tester.generateReport());
      break;

    case 'invalidation':
      tester.runCacheInvalidationTest().then(() => tester.generateReport());
      break;

    case 'lighthouse':
      process.env.RUN_LIGHTHOUSE = 'true';
      tester.runLighthouseTest().then(() => tester.generateReport());
      break;

    case 'all':
    default:
      tester.runAllTests();
      break;
  }
}

module.exports = CacheTester;
