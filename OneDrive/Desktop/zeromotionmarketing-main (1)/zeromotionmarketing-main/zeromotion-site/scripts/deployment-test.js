#!/usr/bin/env node

/**
 * Deployment Verification Script for ZeroMotion
 * Tests critical functionality of the deployed site
 */

import fetch from 'node-fetch';
import https from 'https';

// Disable SSL certificate validation for self-signed certs if needed
const agent = new https.Agent({
  rejectUnauthorized: false
});

const SITE_URL = 'https://www.zeromotionmarketing.com';
const TIMEOUT = 30000; // 30 seconds

class DeploymentTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      siteUrl: SITE_URL,
      tests: {},
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0,
        total: 0
      }
    };
  }

  async testEndpoint(url, description, options = {}) {
    const startTime = Date.now();

    try {
      console.log(`🔍 Testing ${description}...`);

      const response = await fetch(url, {
        timeout: TIMEOUT,
        agent,
        ...options
      });

      const responseTime = Date.now() - startTime;
      const status = response.status;

      const result = {
        url,
        status,
        responseTime,
        success: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      };

      if (response.ok) {
        // Try to get some content to verify it's not an error page
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const text = await response.text();
          result.contentLength = text.length;
          result.hasExpectedContent = text.length > 100; // Basic check for substantial content
        }
      }

      this.results.tests[description] = {
        name: description,
        status: response.ok ? 'PASS' : 'FAIL',
        details: result
      };

      console.log(`${response.ok ? '✅' : '❌'} ${description}: ${status} (${responseTime}ms)`);

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;

      this.results.tests[description] = {
        name: description,
        status: 'FAIL',
        details: {
          error: error.message,
          responseTime
        }
      };

      console.log(`❌ ${description}: ${error.message} (${responseTime}ms)`);
      return null;
    }
  }

  async runCriticalTests() {
    console.log('🚀 Starting ZeroMotion Deployment Verification...\n');

    // Test homepage
    await this.testEndpoint(`${SITE_URL}/`, 'Homepage Load');

    // Test critical pages
    await this.testEndpoint(`${SITE_URL}/pricing`, 'Pricing Page');
    await this.testEndpoint(`${SITE_URL}/services/web-design`, 'Web Design Service');
    await this.testEndpoint(`${SITE_URL}/services/brand-identity`, 'Brand Identity Service');
    await this.testEndpoint(`${SITE_URL}/services/ai-integration`, 'AI Integration Service');
    await this.testEndpoint(`${SITE_URL}/services/crm`, 'CRM Service');

    // Test plan pages
    await this.testEndpoint(`${SITE_URL}/plans/starter`, 'Starter Plan');
    await this.testEndpoint(`${SITE_URL}/plans/growth`, 'Growth Plan');
    await this.testEndpoint(`${SITE_URL}/plans/scale`, 'Scale Plan');

    // Test API endpoints
    await this.testEndpoint(`${SITE_URL}/api/health`, 'Health Check API');

    // Test static assets
    await this.testEndpoint(`${SITE_URL}/favicon.ico`, 'Favicon');
    await this.testEndpoint(`${SITE_URL}/robots.txt`, 'Robots.txt');
    await this.testEndpoint(`${SITE_URL}/sitemap.xml`, 'Sitemap');

    // Test error pages
    await this.testEndpoint(`${SITE_URL}/404-test`, '404 Error Page', { redirect: 'manual' });
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 DEPLOYMENT VERIFICATION RESULTS');
    console.log('='.repeat(60));

    // Calculate summary
    Object.values(this.results.tests).forEach(test => {
      this.results.summary.total++;
      if (test.status === 'PASS') {
        this.results.summary.passed++;
      } else if (test.status === 'FAIL') {
        this.results.summary.failed++;
      }
    });

    const successRate = ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1);

    console.log(`📊 Success Rate: ${successRate}%`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`📈 Total Tests: ${this.results.summary.total}`);
    console.log('='.repeat(60));

    // Print detailed results
    Object.values(this.results.tests).forEach(test => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${test.name}: ${test.status}`);

      if (test.details) {
        if (test.details.status) {
          console.log(`   Status: ${test.details.status}, Response Time: ${test.details.responseTime}ms`);
        }
        if (test.details.error) {
          console.log(`   Error: ${test.details.error}`);
        }
        if (test.details.contentLength) {
          console.log(`   Content Length: ${test.details.contentLength} bytes`);
        }
      }
      console.log('');
    });

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    if (this.results.summary.failed > 0) {
      console.log('- Review failed endpoints and check server logs');
      console.log('- Verify Vercel deployment completed successfully');
      console.log('- Check for any build errors in Vercel dashboard');
    }

    if (successRate < 90) {
      console.log('- Multiple endpoints failing - investigate deployment issues');
      console.log('- Check Vercel build logs for detailed error information');
    }

    if (successRate >= 95) {
      console.log('- Deployment appears successful!');
      console.log('- All critical functionality is working');
      console.log('- Ready for production traffic');
    }

    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Monitor Vercel deployment status');
    console.log('2. Check Vercel build logs for any warnings');
    console.log('3. Test forms and interactive elements manually');
    console.log('4. Verify analytics and tracking are working');
    console.log('5. Run performance tests on live site');
  }

  async saveReport() {
    const fs = await import('fs');
    const reportPath = 'deployment-verification-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run the deployment verification
async function main() {
  const tester = new DeploymentTester();

  try {
    await tester.runCriticalTests();
    tester.generateReport();
    await tester.saveReport();
  } catch (error) {
    console.error('❌ Deployment verification failed:', error);
    process.exit(1);
  }
}

main();
