import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';
const PAGES_TO_TEST = [
  '/',
  '/pricing',
  '/services/web-design',
  '/services/brand-identity',
  '/services/crm',
  '/plans/starter',
  '/plans/growth',
  '/plans/scale'
];

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: 2500,    // Largest Contentful Paint < 2.5s
  FID: 100,     // First Input Delay < 100ms
  CLS: 0.1,     // Cumulative Layout Shift < 0.1
  FCP: 1800,    // First Contentful Paint < 1.8s
  TTI: 3800,    // Time to Interactive < 3.8s
  SI: 3000,     // Speed Index < 3.0s
  TBT: 200      // Total Blocking Time < 200ms
};

class PerformanceTester {
  constructor() {
    this.results = [];
    this.reportDir = path.join(__dirname, '..', 'performance-reports');
    this.ensureReportDir();
  }

  ensureReportDir() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  async runLighthouse(url, outputPath) {
    const command = `lighthouse "${url}" \
      --output=json \
      --output-path="${outputPath}" \
      --chrome-flags="--headless --no-sandbox --disable-gpu" \
      --throttling-method=simulate \
      --throttling.cpuSlowdownMultiplier=4 \
      --throttling.requestLatencyMs=150 \
      --throttling.downloadThroughputKbps=1638 \
      --throttling.uploadThroughputKbps=675 \
      --emulated-form-factor=mobile \
      --preset=perf \
      --quiet`;

    try {
      execSync(command, { stdio: 'pipe' });
      return true;
    } catch (error) {
      console.error(`Lighthouse failed for ${url}:`, error.message);
      return false;
    }
  }

  parseResults(reportPath) {
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const audits = report.audits;
      
      return {
        url: report.finalUrl,
        timestamp: report.fetchTime,
        performance: report.categories.performance.score * 100,
        metrics: {
          LCP: audits['largest-contentful-paint']?.numericValue || 0,
          FID: audits['max-potential-fid']?.numericValue || 0,
          CLS: audits['cumulative-layout-shift']?.numericValue || 0,
          FCP: audits['first-contentful-paint']?.numericValue || 0,
          TTI: audits['interactive']?.numericValue || 0,
          SI: audits['speed-index']?.numericValue || 0,
          TBT: audits['total-blocking-time']?.numericValue || 0
        },
        opportunities: {
          'unused-css-rules': audits['unused-css-rules']?.details?.overallSavingsMs || 0,
          'unused-javascript': audits['unused-javascript']?.details?.overallSavingsMs || 0,
          'render-blocking-resources': audits['render-blocking-resources']?.details?.overallSavingsMs || 0,
          'unminified-css': audits['unminified-css']?.details?.overallSavingsMs || 0,
          'unminified-javascript': audits['unminified-javascript']?.details?.overallSavingsMs || 0,
          'efficient-animated-content': audits['efficient-animated-content']?.details?.overallSavingsMs || 0,
          'modern-image-formats': audits['modern-image-formats']?.details?.overallSavingsMs || 0,
          'offscreen-images': audits['offscreen-images']?.details?.overallSavingsMs || 0
        },
        diagnostics: {
          'dom-size': audits['dom-size']?.numericValue || 0,
          'critical-request-chains': audits['critical-request-chains']?.details?.longestChain?.length || 0,
          'main-thread-tasks': audits['main-thread-tasks']?.details?.items?.length || 0,
          'network-requests': audits['network-requests']?.details?.items?.length || 0
        }
      };
    } catch (error) {
      console.error(`Failed to parse report ${reportPath}:`, error.message);
      return null;
    }
  }

  checkThresholds(metrics) {
    const issues = [];
    
    Object.entries(THRESHOLDS).forEach(([metric, threshold]) => {
      if (metrics[metric] && metrics[metric] > threshold) {
        issues.push({
          metric,
          value: metrics[metric],
          threshold,
          severity: this.getSeverity(metrics[metric], threshold)
        });
      }
    });
    
    return issues;
  }

  getSeverity(value, threshold) {
    const ratio = value / threshold;
    if (ratio > 2) return 'critical';
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  }

  async testPage(page) {
    console.log(`Testing ${page}...`);
    
    const url = `${SITE_URL}${page}`;
    const reportPath = path.join(this.reportDir, `lighthouse-${page.replace(/\//g, '-')}-${Date.now()}.json`);
    
    const success = await this.runLighthouse(url, reportPath);
    if (!success) {
      return null;
    }
    
    const results = this.parseResults(reportPath);
    if (!results) {
      return null;
    }
    
    results.issues = this.checkThresholds(results.metrics);
    results.page = page;
    
    // Clean up individual report
    fs.unlinkSync(reportPath);
    
    return results;
  }

  async runAllTests() {
    console.log('🚀 Starting performance tests...\n');
    
    for (const page of PAGES_TO_TEST) {
      const result = await this.testPage(page);
      if (result) {
        this.results.push(result);
      }
    }
    
    this.generateReport();
  }

  generateReport() {
    const timestamp = new Date().toISOString();
    const reportPath = path.join(this.reportDir, `performance-report-${Date.now()}.json`);
    
    // Calculate overall statistics
    const stats = {
      totalPages: this.results.length,
      averagePerformance: this.results.reduce((sum, r) => sum + r.performance, 0) / this.results.length,
      passedPages: this.results.filter(r => r.issues.length === 0).length,
      criticalIssues: this.results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0),
      highIssues: this.results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'high').length, 0)
    };
    
    const report = {
      timestamp,
      siteUrl: SITE_URL,
      thresholds: THRESHOLDS,
      statistics: stats,
      results: this.results
    };
    
    // Save detailed JSON report
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate console summary
    this.printSummary(stats);
    
    console.log(`\n📊 Detailed report saved to: ${reportPath}`);
  }

  printSummary(stats) {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 PERFORMANCE SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`📄 Pages tested: ${stats.totalPages}`);
    console.log(`⚡ Average performance score: ${stats.averagePerformance.toFixed(1)}/100`);
    console.log(`✅ Pages passing all thresholds: ${stats.passedPages}/${stats.totalPages}`);
    console.log(`🔴 Critical issues: ${stats.criticalIssues}`);
    console.log(`🟡 High priority issues: ${stats.highIssues}`);
    
    console.log('\n📋 PAGE RESULTS:');
    this.results.forEach(result => {
      const status = result.issues.length === 0 ? '✅' : 
                    result.issues.some(i => i.severity === 'critical') ? '🔴' : 
                    result.issues.some(i => i.severity === 'high') ? '🟡' : '🟠';
      
      console.log(`${status} ${result.page} - Score: ${result.performance.toFixed(1)} - LCP: ${(result.metrics.LCP/1000).toFixed(1)}s - CLS: ${result.metrics.CLS.toFixed(3)}`);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          const emoji = issue.severity === 'critical' ? '🔴' : 
                       issue.severity === 'high' ? '🟡' : '🟠';
          console.log(`   ${emoji} ${issue.metric}: ${issue.value} (threshold: ${issue.threshold})`);
        });
      }
    });
    
    console.log('\n🎯 CORE WEB VITALS SUMMARY:');
    const avgMetrics = {};
    Object.keys(THRESHOLDS).forEach(metric => {
      avgMetrics[metric] = this.results.reduce((sum, r) => sum + (r.metrics[metric] || 0), 0) / this.results.length;
      const status = avgMetrics[metric] <= THRESHOLDS[metric] ? '✅' : '❌';
      const unit = ['LCP', 'FCP', 'TTI', 'SI', 'TBT'].includes(metric) ? 'ms' : metric === 'CLS' ? '' : 'ms';
      console.log(`${status} ${metric}: ${avgMetrics[metric].toFixed(metric === 'CLS' ? 3 : 0)}${unit} (threshold: ${THRESHOLDS[metric]}${unit})`);
    });
  }
}

// Run the performance tests
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new PerformanceTester();
  tester.runAllTests().catch(console.error);
}

export default PerformanceTester;
