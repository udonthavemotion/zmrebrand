#!/usr/bin/env node

/**
 * Mobile Form Testing Script
 * Tests form functionality and mobile responsiveness
 */

const { chromium } = require('playwright');

async function testMobileForms() {
  console.log('🔍 Starting Mobile Form Testing...\n');
  
  const browser = await chromium.launch({ headless: false });
  
  // Test different mobile devices
  const devices = [
    'iPhone 12',
    'iPhone 12 Pro Max',
    'Samsung Galaxy S21',
    'iPad',
    'iPhone SE'
  ];
  
  const testResults = [];
  
  for (const deviceName of devices) {
    console.log(`📱 Testing on ${deviceName}...`);
    
    const context = await browser.newContext({
      ...require('playwright').devices[deviceName]
    });
    
    const page = await context.newPage();
    
    try {
      // Test pricing page form modals
      await page.goto('http://localhost:4321/pricing');
      await page.waitForLoadState('networkidle');
      
      // Test lead modal opening
      console.log(`  ✓ Testing lead modal on ${deviceName}`);
      const leadButton = page.locator('button:has-text("Get Growth Plan")').first();
      await leadButton.click();
      
      // Wait for modal to appear
      await page.waitForSelector('#lead-modal', { state: 'visible', timeout: 5000 });
      
      // Check if modal is properly sized
      const modal = page.locator('#lead-modal');
      const modalBounds = await modal.boundingBox();
      const viewport = page.viewportSize();
      
      const isFullScreen = modalBounds.width >= viewport.width * 0.95;
      const hasProperHeight = modalBounds.height >= viewport.height * 0.8;
      
      console.log(`    Modal dimensions: ${modalBounds.width}x${modalBounds.height}`);
      console.log(`    Viewport: ${viewport.width}x${viewport.height}`);
      console.log(`    Full screen: ${isFullScreen}, Proper height: ${hasProperHeight}`);
      
      // Test iframe loading
      const iframe = page.locator('#lead-form-iframe');
      await iframe.waitFor({ state: 'visible', timeout: 10000 });
      
      // Test close button functionality
      const closeButton = page.locator('.lead-modal-close');
      await closeButton.click();
      await page.waitForSelector('#lead-modal', { state: 'hidden', timeout: 3000 });
      
      console.log(`  ✅ Lead modal test passed on ${deviceName}`);
      
      // Test contact page form
      await page.goto('http://localhost:4321/contact');
      await page.waitForLoadState('networkidle');
      
      // Check inline form visibility and interaction
      const contactIframe = page.locator('#inline-vSs75oKjAPcQGOAT8xOK');
      await contactIframe.waitFor({ state: 'visible', timeout: 10000 });
      
      const iframeBounds = await contactIframe.boundingBox();
      const hasMinHeight = iframeBounds.height >= 400;
      
      console.log(`  ✓ Contact form dimensions: ${iframeBounds.width}x${iframeBounds.height}`);
      console.log(`  ✅ Contact form test passed on ${deviceName}`);
      
      testResults.push({
        device: deviceName,
        leadModal: { passed: true, fullScreen: isFullScreen, properHeight: hasProperHeight },
        contactForm: { passed: true, minHeight: hasMinHeight },
        viewport: viewport
      });
      
    } catch (error) {
      console.log(`  ❌ Test failed on ${deviceName}: ${error.message}`);
      testResults.push({
        device: deviceName,
        error: error.message,
        passed: false
      });
    }
    
    await context.close();
    console.log('');
  }
  
  await browser.close();
  
  // Generate report
  console.log('📊 TEST RESULTS SUMMARY\n');
  console.log('='.repeat(50));
  
  const passedTests = testResults.filter(r => r.passed !== false);
  const failedTests = testResults.filter(r => r.passed === false);
  
  console.log(`✅ Passed: ${passedTests.length}/${testResults.length}`);
  console.log(`❌ Failed: ${failedTests.length}/${testResults.length}\n`);
  
  if (failedTests.length > 0) {
    console.log('FAILED TESTS:');
    failedTests.forEach(test => {
      console.log(`  ${test.device}: ${test.error}`);
    });
    console.log('');
  }
  
  console.log('DETAILED RESULTS:');
  passedTests.forEach(test => {
    console.log(`${test.device}:`);
    console.log(`  Viewport: ${test.viewport.width}x${test.viewport.height}`);
    console.log(`  Lead Modal: ${test.leadModal.fullScreen ? '✓' : '⚠'} Full Screen, ${test.leadModal.properHeight ? '✓' : '⚠'} Proper Height`);
    console.log(`  Contact Form: ${test.contactForm.minHeight ? '✓' : '⚠'} Min Height`);
    console.log('');
  });
  
  return testResults;
}

// Additional function to test touch interactions
async function testTouchInteractions() {
  console.log('👆 Testing Touch Interactions...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    ...require('playwright').devices['iPhone 12']
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:4321/pricing');
    await page.waitForLoadState('networkidle');
    
    // Test touch events on buttons
    const leadButton = page.locator('button:has-text("Get Growth Plan")').first();
    
    // Simulate touch start
    await leadButton.dispatchEvent('touchstart');
    await page.waitForTimeout(100);
    
    // Simulate touch end (should open modal)
    await leadButton.dispatchEvent('touchend');
    
    // Check if modal opens
    await page.waitForSelector('#lead-modal', { state: 'visible', timeout: 5000 });
    console.log('  ✅ Touch interaction opens modal successfully');
    
    // Test close button touch
    const closeButton = page.locator('.lead-modal-close');
    await closeButton.dispatchEvent('touchstart');
    await page.waitForTimeout(100);
    await closeButton.dispatchEvent('touchend');
    
    await page.waitForSelector('#lead-modal', { state: 'hidden', timeout: 3000 });
    console.log('  ✅ Touch interaction closes modal successfully');
    
  } catch (error) {
    console.log(`  ❌ Touch interaction test failed: ${error.message}`);
  }
  
  await browser.close();
}

// Run tests
if (require.main === module) {
  (async () => {
    try {
      await testMobileForms();
      await testTouchInteractions();
      console.log('🎉 All mobile form tests completed!');
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = { testMobileForms, testTouchInteractions };
