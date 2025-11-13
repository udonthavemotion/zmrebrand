import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for ZeroMotion Marketing Site
 * Critical user journeys and security validations
 */

test.describe('Homepage Smoke Tests', () => {
  test('homepage should load successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    // Verify critical elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('homepage should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/ZeroMotion Marketing/);
    
    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeLessThan(160); // SEO best practice
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
  });

  test('homepage should have JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    
    const parsed = JSON.parse(jsonLd!);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBeTruthy();
  });
});

test.describe('Contact Form Tests', () => {
  test('contact section should be visible', async ({ page }) => {
    await page.goto('/#contact');
    
    // Wait for iframe to load
    const iframe = page.frameLocator('iframe[src*="link.zeromotionmarketing.com"]');
    await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('GHL form embed script should load', async ({ page }) => {
    await page.goto('/#contact');
    
    // Check if form embed script loaded
    const scriptLoaded = await page.evaluate(() => {
      return Array.from(document.scripts).some(script => 
        script.src.includes('form_embed.js')
      );
    });
    
    expect(scriptLoaded).toBe(true);
  });
});

test.describe('Legal Pages Tests', () => {
  test('privacy policy should load', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBe(200);
    
    await expect(page.locator('h1')).toContainText(/Privacy/i);
  });

  test('terms of service should load', async ({ page }) => {
    const response = await page.goto('/terms');
    expect(response?.status()).toBe(200);
    
    await expect(page.locator('h1')).toContainText(/Terms/i);
  });

  test('cookies policy should load', async ({ page }) => {
    const response = await page.goto('/cookies');
    expect(response?.status()).toBe(200);
  });
});

test.describe('Error Pages Tests', () => {
  test('404 page should render for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');
    expect(response?.status()).toBe(404);
    
    // Verify no sensitive info exposed
    const content = await page.content();
    expect(content).not.toContain('stack trace');
    expect(content).not.toContain('internal server error');
  });
});

test.describe('Security Headers Tests', () => {
  test('should have comprehensive security headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() || {};
    
    // HSTS
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
    
    // Frame protection
    expect(headers['x-frame-options']).toBe('DENY');
    
    // Content type sniffing protection
    expect(headers['x-content-type-options']).toBe('nosniff');
    
    // Referrer policy
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  test('CSP header should not contain unsafe directives', async ({ page }) => {
    const response = await page.goto('/');
    const csp = response?.headers()['content-security-policy'];
    
    expect(csp).toBeDefined();
    expect(csp).not.toContain('unsafe-inline');
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).toContain('frame-ancestors');
  });
});

test.describe('Performance Tests', () => {
  test('homepage should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('static assets should have immutable cache headers', async ({ page }) => {
    await page.goto('/');
    
    // Find a static asset (image, CSS, or JS)
    const response = await page.waitForResponse(
      response => response.url().match(/\.(css|js|png|jpg|webp)$/) !== null,
      { timeout: 5000 }
    );
    
    const cacheControl = response.headers()['cache-control'];
    expect(cacheControl).toContain('immutable');
  });
});

test.describe('Accessibility Tests', () => {
  test('homepage should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThan(3); // Should have 1-2 h1 tags max
  });

  test('all images should have alt attributes', async ({ page }) => {
    await page.goto('/');
    
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE
  });

  test('homepage should render properly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check if hamburger menu exists (common mobile pattern)
    await expect(page.locator('nav')).toBeVisible();
    
    // Verify no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe('SEO Tests', () => {
  test('robots.txt should be accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('User-agent:');
    expect(content).toContain('Sitemap:');
  });

  test('sitemap.xml should be accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    expect(content).toContain('<urlset');
    expect(content).toContain('</urlset>');
  });
});

