#!/usr/bin/env node

/**
 * Video Background Testing Script
 * Tests video stability, loading, and visual quality across all pages
 */

import { chromium, devices } from 'playwright';

async function testVideoBackgrounds() {
  console.log('🎥 Starting Video Background Testing...\n');
  
  const browser = await chromium.launch({ headless: false });
  
  // Pages with video backgrounds to test
  const testPages = [
    { url: 'http://localhost:4323/', name: 'Homepage', videoSelectors: ['.stable-hero-video', '.stable-video'] },
    { url: 'http://localhost:4323/pricing', name: 'Pricing', videoSelectors: ['.stable-pricing-video', '.stable-video'] },
    { url: 'http://localhost:4323/plans/starter', name: 'Starter Plan', videoSelectors: ['.stable-plan-video'] },
    { url: 'http://localhost:4323/plans/growth', name: 'Growth Plan', videoSelectors: ['.stable-plan-video'] },
    { url: 'http://localhost:4323/plans/scale', name: 'Scale Plan', videoSelectors: ['.stable-plan-video'] },
    { url: 'http://localhost:4323/services/crm', name: 'CRM Service', videoSelectors: ['video'] },
    { url: 'http://localhost:4323/services/web-design', name: 'Web Design', videoSelectors: ['video'] },
    { url: 'http://localhost:4323/contact', name: 'Contact', videoSelectors: [] } // No video backgrounds
  ];
  
  const testResults = [];
  
  // Test on both desktop and mobile
  const devices = ['Desktop Chrome', 'iPhone 12'];
  
  for (const deviceName of devices) {
    console.log(`📱 Testing on ${deviceName}...\n`);
    
    const context = deviceName === 'Desktop Chrome' 
      ? await browser.newContext({ viewport: { width: 1920, height: 1080 } })
      : await browser.newContext({ ...devices[deviceName] });
    
    const page = await context.newPage();
    
    for (const testPage of testPages) {
      console.log(`  🔍 Testing ${testPage.name}...`);
      
      try {
        await page.goto(testPage.url);
        await page.waitForLoadState('networkidle');
        
        const pageResults = {
          page: testPage.name,
          device: deviceName,
          url: testPage.url,
          videos: [],
          passed: true,
          issues: []
        };
        
        // Test each video selector
        for (const selector of testPage.videoSelectors) {
          const videos = await page.locator(selector).all();
          
          for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            
            try {
              // Wait for video to be visible
              await video.waitFor({ state: 'visible', timeout: 5000 });
              
              // Check if video has loaded class
              const hasLoadedClass = await video.evaluate(el => el.classList.contains('loaded'));
              
              // Check video properties
              const videoProps = await video.evaluate(el => ({
                currentTime: el.currentTime,
                duration: el.duration,
                readyState: el.readyState,
                videoWidth: el.videoWidth,
                videoHeight: el.videoHeight,
                paused: el.paused,
                ended: el.ended,
                muted: el.muted,
                loop: el.loop,
                autoplay: el.autoplay,
                src: el.src,
                style: {
                  opacity: getComputedStyle(el).opacity,
                  visibility: getComputedStyle(el).visibility,
                  filter: getComputedStyle(el).filter
                }
              }));
              
              // Check for brightness and colorfulness
              const isVisible = videoProps.style.visibility === 'visible';
              const hasGoodOpacity = parseFloat(videoProps.style.opacity) >= 0.5;
              const isPlaying = !videoProps.paused && !videoProps.ended && videoProps.currentTime > 0;
              const hasDimensions = videoProps.videoWidth > 0 && videoProps.videoHeight > 0;
              
              const videoResult = {
                selector: selector,
                index: i,
                loaded: hasLoadedClass,
                visible: isVisible,
                playing: isPlaying,
                opacity: videoProps.style.opacity,
                filter: videoProps.style.filter,
                dimensions: `${videoProps.videoWidth}x${videoProps.videoHeight}`,
                duration: videoProps.duration,
                currentTime: videoProps.currentTime,
                readyState: videoProps.readyState,
                issues: []
              };
              
              // Check for issues
              if (!hasLoadedClass) {
                videoResult.issues.push('Missing loaded class - may flicker');
                pageResults.passed = false;
              }
              
              if (!isVisible) {
                videoResult.issues.push('Video not visible');
                pageResults.passed = false;
              }
              
              if (!hasGoodOpacity) {
                videoResult.issues.push(`Low opacity (${videoProps.style.opacity}) - may appear dim`);
                pageResults.passed = false;
              }
              
              if (!isPlaying && videoProps.readyState >= 3) {
                videoResult.issues.push('Video not playing despite being ready');
                pageResults.passed = false;
              }
              
              if (!hasDimensions) {
                videoResult.issues.push('Video has no dimensions');
                pageResults.passed = false;
              }
              
              // Check for brightness filter
              if (videoProps.style.filter.includes('brightness(')) {
                const brightnessMatch = videoProps.style.filter.match(/brightness\\(([^)]+)\\)/);
                if (brightnessMatch) {
                  const brightness = parseFloat(brightnessMatch[1]);
                  if (brightness < 0.7) {
                    videoResult.issues.push(`Low brightness filter (${brightness}) - may appear dim`);
                  } else if (brightness >= 0.8) {
                    videoResult.issues.push(`Good brightness filter (${brightness}) - colorful display ✓`);
                  }
                }
              }
              
              pageResults.videos.push(videoResult);
              
              console.log(`    📹 Video ${i + 1} (${selector}): ${videoResult.issues.length === 0 ? '✅ PASS' : '⚠️ ISSUES'}`);
              if (videoResult.issues.length > 0) {
                videoResult.issues.forEach(issue => console.log(`      - ${issue}`));
              }
              
            } catch (error) {
              pageResults.videos.push({
                selector: selector,
                index: i,
                error: error.message,
                issues: ['Failed to load or test video']
              });
              pageResults.passed = false;
              console.log(`    ❌ Video ${i + 1} (${selector}): ERROR - ${error.message}`);
            }
          }
        }
        
        // Overall page assessment
        const totalVideos = pageResults.videos.length;
        const workingVideos = pageResults.videos.filter(v => !v.error && v.visible && v.playing).length;
        
        console.log(`    📊 Result: ${workingVideos}/${totalVideos} videos working properly`);
        console.log(`    ${pageResults.passed ? '✅ PASS' : '⚠️ ISSUES FOUND'}`);
        
        testResults.push(pageResults);
        
      } catch (error) {
        console.log(`    ❌ Page failed to load: ${error.message}`);
        testResults.push({
          page: testPage.name,
          device: deviceName,
          url: testPage.url,
          error: error.message,
          passed: false
        });
      }
      
      console.log('');
    }
    
    await context.close();
    console.log(`📱 ${deviceName} testing completed\\n`);
  }
  
  await browser.close();
  
  // Generate comprehensive report
  console.log('📊 VIDEO BACKGROUND TEST RESULTS\\n');
  console.log('='.repeat(60));
  
  const allTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const failedTests = allTests - passedTests;
  
  console.log(`✅ Passed: ${passedTests}/${allTests}`);
  console.log(`❌ Failed: ${failedTests}/${allTests}`);
  console.log(`📈 Success Rate: ${Math.round((passedTests / allTests) * 100)}%\\n`);
  
  // Detailed results by page
  const pageGroups = {};
  testResults.forEach(result => {
    if (!pageGroups[result.page]) pageGroups[result.page] = [];
    pageGroups[result.page].push(result);
  });
  
  console.log('DETAILED RESULTS BY PAGE:\\n');
  
  Object.keys(pageGroups).forEach(pageName => {
    console.log(`📄 ${pageName}:`);
    const pageTests = pageGroups[pageName];
    
    pageTests.forEach(test => {
      console.log(`  ${test.device}: ${test.passed ? '✅ PASS' : '❌ FAIL'}`);
      
      if (test.videos && test.videos.length > 0) {
        test.videos.forEach((video, index) => {
          const status = video.error ? '❌' : (video.visible && video.playing ? '✅' : '⚠️');
          console.log(`    Video ${index + 1}: ${status} ${video.opacity ? `opacity: ${video.opacity}` : ''} ${video.dimensions ? `${video.dimensions}` : ''}`);
          
          if (video.issues && video.issues.length > 0) {
            video.issues.forEach(issue => {
              console.log(`      - ${issue}`);
            });
          }
        });
      }
      
      if (test.error) {
        console.log(`    Error: ${test.error}`);
      }
    });
    
    console.log('');
  });
  
  // Summary recommendations
  console.log('RECOMMENDATIONS:\\n');
  
  const commonIssues = {};
  testResults.forEach(result => {
    if (result.videos) {
      result.videos.forEach(video => {
        if (video.issues) {
          video.issues.forEach(issue => {
            commonIssues[issue] = (commonIssues[issue] || 0) + 1;
          });
        }
      });
    }
  });
  
  Object.keys(commonIssues).forEach(issue => {
    if (commonIssues[issue] > 1) {
      console.log(`🔧 ${issue} (${commonIssues[issue]} occurrences)`);
    }
  });
  
  if (Object.keys(commonIssues).length === 0) {
    console.log('🎉 No common issues found! Video backgrounds are working well.');
  }
  
  return testResults;
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      await testVideoBackgrounds();
      console.log('\\n🎉 Video background testing completed!');
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  })();
}

export { testVideoBackgrounds };
