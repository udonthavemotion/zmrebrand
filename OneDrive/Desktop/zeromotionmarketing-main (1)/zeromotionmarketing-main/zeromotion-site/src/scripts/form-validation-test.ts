/**
 * Comprehensive Form and Logo Validation Test Suite
 * Tests all scenarios for mobile and desktop form interactions
 */

interface TestResult {
  test: string;
  passed: boolean;
  details: string;
}

class FormLogoValidator {
  private results: TestResult[] = [];
  
  constructor() {
    this.runAllTests();
  }

  private addResult(test: string, passed: boolean, details: string) {
    this.results.push({ test, passed, details });
    console.log(`${passed ? '✅' : '❌'} ${test}: ${details}`);
  }

  private async testLogoTransparency(): Promise<void> {
    const logoContainer = document.querySelector('[data-logo]');
    const logoVideo = logoContainer?.querySelector('video');
    
    if (!logoContainer || !logoVideo) {
      this.addResult('Logo Container', false, 'Logo container or video not found');
      return;
    }

    // Test iOS transparency
    const computedStyle = window.getComputedStyle(logoVideo);
    const hasTransparentBg = computedStyle.backgroundColor === 'transparent' || 
                             computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)';
    
    this.addResult('Logo Transparency', hasTransparentBg, 
      `Background: ${computedStyle.backgroundColor}, Opacity: ${computedStyle.opacity}`);

    // Test video loading
    const videoLoaded = logoVideo.readyState >= 3;
    this.addResult('Logo Video Loading', videoLoaded, 
      `Ready state: ${logoVideo.readyState}, Current time: ${logoVideo.currentTime}`);

    // Test mobile-specific styles
    if (window.innerWidth <= 768) {
      const hasHardwareAccel = computedStyle.transform !== 'none';
      this.addResult('Mobile Hardware Acceleration', hasHardwareAccel, 
        `Transform: ${computedStyle.transform}`);
    }
  }

  private async testModalZIndex(): Promise<void> {
    const modals = [
      'lead-modal',
      'strategist-modal', 
      'booking-modal-',
      'crm-registration-modal'
    ];

    for (const modalId of modals) {
      const modal = document.getElementById(modalId) || 
                   document.querySelector(`[id^="${modalId}"]`);
      
      if (modal) {
        const zIndex = window.getComputedStyle(modal).zIndex;
        const hasMaxZIndex = zIndex === '2147483647';
        
        this.addResult(`${modalId} Z-Index`, hasMaxZIndex, 
          `Z-Index: ${zIndex} (Expected: 2147483647)`);
      } else {
        this.addResult(`${modalId} Existence`, false, 'Modal element not found');
      }
    }
  }

  private async testFooterNavbarZIndex(): Promise<void> {
    const footer = document.querySelector('footer');
    const navbar = document.querySelector('#navbar');

    if (footer) {
      const footerZIndex = parseInt(window.getComputedStyle(footer).zIndex || '0');
      const footerOk = footerZIndex < 1000;
      this.addResult('Footer Z-Index', footerOk, 
        `Footer Z-Index: ${footerZIndex} (Should be < 1000)`);
    }

    if (navbar) {
      const navbarZIndex = parseInt(window.getComputedStyle(navbar).zIndex || '0');
      const navbarOk = navbarZIndex < 1000;
      this.addResult('Navbar Z-Index', navbarOk, 
        `Navbar Z-Index: ${navbarZIndex} (Should be < 1000)`);
    }
  }

  private async testMobileViewport(): Promise<void> {
    if (window.innerWidth > 768) {
      this.addResult('Mobile Viewport Test', true, 'Skipped - Desktop viewport');
      return;
    }

    // Test viewport units
    const testEl = document.createElement('div');
    testEl.style.height = '100vh';
    testEl.style.position = 'fixed';
    testEl.style.top = '0';
    testEl.style.visibility = 'hidden';
    document.body.appendChild(testEl);

    const viewportHeight = testEl.offsetHeight;
    const windowHeight = window.innerHeight;
    const heightMatches = Math.abs(viewportHeight - windowHeight) < 50;

    document.body.removeChild(testEl);

    this.addResult('Mobile Viewport Height', heightMatches, 
      `100vh: ${viewportHeight}px, window: ${windowHeight}px`);

    // Test dynamic viewport units if supported
    const supportsDvh = CSS.supports('height', '100dvh');
    this.addResult('Dynamic Viewport Support', supportsDvh, 
      supportsDvh ? 'dvh units supported' : 'dvh units not supported');
  }

  private async testFormInteraction(): Promise<void> {
    // Test if form functions exist
    const formFunctions = [
      'openLeadModal',
      'closeLeadModal',
      'openStrategistModal',
      'closeStrategistModal',
      'openBookingModal',
      'closeBookingModal'
    ];

    for (const funcName of formFunctions) {
      const funcExists = typeof (window as any)[funcName] === 'function';
      this.addResult(`${funcName} Function`, funcExists, 
        funcExists ? 'Function available' : 'Function missing');
    }

    // Test modal configuration
    const leadConfig = (window as any).leadModalConfig;
    const configExists = leadConfig && typeof leadConfig === 'object';
    this.addResult('Lead Modal Config', configExists, 
      configExists ? `${Object.keys(leadConfig).length} contexts configured` : 'Config missing');
  }

  private async testTouchEvents(): Promise<void> {
    if (!('ontouchstart' in window)) {
      this.addResult('Touch Events', true, 'Skipped - Non-touch device');
      return;
    }

    // Test if touch events are properly handled
    const buttons = document.querySelectorAll('.btn-primary, .hero-crm-btn');
    let touchHandlersFound = 0;

    buttons.forEach(button => {
      const hasTouch = button.classList.contains('touch-active') || 
                      button.hasAttribute('ontouchstart');
      if (hasTouch) touchHandlersFound++;
    });

    this.addResult('Touch Event Handlers', touchHandlersFound > 0, 
      `${touchHandlersFound} buttons with touch handlers`);
  }

  private async testScrollLocking(): Promise<void> {
    // This test would need to be run when a modal is actually open
    // For now, just check if the functions handle scroll properly
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    
    this.addResult('Initial Scroll State', 
      bodyOverflow !== 'hidden' && htmlOverflow !== 'hidden',
      `Body: ${bodyOverflow || 'auto'}, HTML: ${htmlOverflow || 'auto'}`);
  }

  private async runAllTests(): Promise<void> {
    console.log('🧪 Starting Form and Logo Validation Tests...');
    
    await this.testLogoTransparency();
    await this.testModalZIndex();
    await this.testFooterNavbarZIndex();
    await this.testMobileViewport();
    await this.testFormInteraction();
    await this.testTouchEvents();
    await this.testScrollLocking();

    this.generateReport();
  }

  private generateReport(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.test}: ${result.details}`);
      });
    }

    // Store results for potential debugging
    (window as any).formValidationResults = {
      summary: { totalTests, passedTests, failedTests },
      details: this.results,
      timestamp: new Date().toISOString()
    };
  }
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FormLogoValidator());
} else {
  new FormLogoValidator();
}

export { FormLogoValidator };
