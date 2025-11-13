#!/usr/bin/env node

/**
 * Security Scanner for ZeroMotion Marketing
 * Performs automated security checks and generates reports
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityScanner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      vulnerabilities: [],
      outdatedPackages: [],
      securityHeaders: [],
      recommendations: []
    };
  }

  async scan() {
    console.log('🔍 Starting security scan for ZeroMotion Marketing...\n');

    await this.checkDependencies();
    await this.checkSecurityHeaders();
    await this.checkFilePermissions();
    await this.checkEnvironmentVariables();
    await this.generateReport();

    console.log('✅ Security scan completed!\n');
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    try {
      // Check for vulnerabilities
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
      const auditData = JSON.parse(auditOutput);
      
      if (auditData.vulnerabilities && Object.keys(auditData.vulnerabilities).length > 0) {
        for (const [pkg, vuln] of Object.entries(auditData.vulnerabilities)) {
          this.results.vulnerabilities.push({
            package: pkg,
            severity: vuln.severity,
            title: vuln.title,
            url: vuln.url
          });
        }
      }

      // Check for outdated packages
      try {
        const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8' });
        const outdatedData = JSON.parse(outdatedOutput);
        
        for (const [pkg, info] of Object.entries(outdatedData)) {
          this.results.outdatedPackages.push({
            package: pkg,
            current: info.current,
            wanted: info.wanted,
            latest: info.latest
          });
        }
      } catch (e) {
        // npm outdated returns non-zero exit code when packages are outdated
      }

    } catch (error) {
      console.warn('⚠️  Could not check dependencies:', error.message);
    }
  }

  async checkSecurityHeaders() {
    console.log('🔒 Checking security headers configuration...');
    
    const vercelConfigPath = path.join(__dirname, '../vercel.json');
    
    if (fs.existsSync(vercelConfigPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      const headers = vercelConfig.headers?.[0]?.headers || [];
      
      const requiredHeaders = [
        'Strict-Transport-Security',
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy'
      ];

      const configuredHeaders = headers.map(h => h.key);
      
      for (const required of requiredHeaders) {
        if (configuredHeaders.includes(required)) {
          this.results.securityHeaders.push({
            header: required,
            status: 'configured',
            value: headers.find(h => h.key === required)?.value
          });
        } else {
          this.results.securityHeaders.push({
            header: required,
            status: 'missing'
          });
        }
      }
    }
  }

  async checkFilePermissions() {
    console.log('📁 Checking file permissions...');
    
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      'vercel.json',
      'package.json'
    ];

    for (const file of sensitiveFiles) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath);
          const mode = (stats.mode & parseInt('777', 8)).toString(8);
          
          if (mode !== '644' && mode !== '600') {
            this.results.recommendations.push({
              type: 'file_permissions',
              file: file,
              current: mode,
              recommended: '644',
              message: `File ${file} has permissions ${mode}, recommend 644 or 600`
            });
          }
        } catch (error) {
          // Skip if can't check permissions
        }
      }
    }
  }

  async checkEnvironmentVariables() {
    console.log('🌍 Checking environment variables...');
    
    const envFiles = ['.env', '.env.local', '.env.production'];
    
    for (const envFile of envFiles) {
      const envPath = path.join(__dirname, '..', envFile);
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        // Check for common security issues
        const lines = envContent.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line && !line.startsWith('#')) {
            // Check for weak or default values
            if (line.includes('password=123') || line.includes('secret=test')) {
              this.results.recommendations.push({
                type: 'weak_credentials',
                file: envFile,
                line: i + 1,
                message: 'Weak or default credentials detected'
              });
            }
            
            // Check for exposed secrets in comments or values
            if (line.toLowerCase().includes('todo') || line.toLowerCase().includes('fixme')) {
              this.results.recommendations.push({
                type: 'incomplete_config',
                file: envFile,
                line: i + 1,
                message: 'Incomplete configuration detected'
              });
            }
          }
        }
      }
    }
  }

  async generateReport() {
    console.log('📊 Generating security report...');
    
    const reportPath = path.join(__dirname, '..', 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate summary
    console.log('\n📋 Security Scan Summary:');
    console.log(`   Vulnerabilities: ${this.results.vulnerabilities.length}`);
    console.log(`   Outdated packages: ${this.results.outdatedPackages.length}`);
    console.log(`   Security headers: ${this.results.securityHeaders.filter(h => h.status === 'configured').length}/${this.results.securityHeaders.length}`);
    console.log(`   Recommendations: ${this.results.recommendations.length}`);

    if (this.results.vulnerabilities.length > 0) {
      console.log('\n🚨 Critical Vulnerabilities:');
      this.results.vulnerabilities
        .filter(v => v.severity === 'critical' || v.severity === 'high')
        .forEach(v => {
          console.log(`   - ${v.package}: ${v.title} (${v.severity})`);
        });
    }

    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.slice(0, 5).forEach(r => {
        console.log(`   - ${r.message}`);
      });
    }

    console.log(`\n📄 Full report saved to: ${reportPath}`);
  }
}

// Run scanner if called directly
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  const scanner = new SecurityScanner();
  scanner.scan().catch(console.error);
}

export default SecurityScanner;
