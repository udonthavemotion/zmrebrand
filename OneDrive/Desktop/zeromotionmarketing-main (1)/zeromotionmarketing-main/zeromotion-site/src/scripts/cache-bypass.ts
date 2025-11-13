/// <reference path="../env.d.ts" />

/**
 * Cache Bypass Utilities for ZeroMotion Marketing
 * Ensures forms, analytics, and dynamic content bypass aggressive caching
 */

export class CacheBypassManager {
  private static instance: CacheBypassManager;
  private bypassedUrls: Set<string> = new Set();

  private constructor() {
    this.initializeBypassRules();
  }

  static getInstance(): CacheBypassManager {
    if (!CacheBypassManager.instance) {
      CacheBypassManager.instance = new CacheBypassManager();
    }
    return CacheBypassManager.instance;
  }

  private initializeBypassRules(): void {
    // URLs that should never be cached
    const bypassPatterns = [
      // Analytics and tracking
      /googletagmanager\.com/,
      /google-analytics\.com/,
      /googletagmanager\.com/,
      /googleads\.g\.doubleclick\.net/,
      /stats\.g\.doubleclick\.net/,

      // ZRM CRM endpoints
      /app\.gohighlevel\.com/,
      /link\.gohighlevel\.com/,
      /api\.gohighlevel\.com/,

      // Social media pixels
      /connect\.facebook\.net/,
      /www\.facebook\.com\/tr/,
      /px\.ads\.linkedin\.com/,
      /ads\.linkedin\.com/,

      // Form submissions
      /\/api\/contact/,
      /\/api\/forms/,
      /\/api\/newsletter/,

      // Payment processing
      /stripe\.com/,
      /paypal\.com/,
      /checkout\./,

      // Live chat and support
      /intercom\.io/,
      /zendesk\.com/,
      /drift\.com/
    ];

    // Store patterns for runtime checking
    (window as any).__cacheBypassPatterns = bypassPatterns;
  }

  /**
   * Check if a URL should bypass cache
   */
  shouldBypassCache(url: string): boolean {
    const patterns = (window as any).__cacheBypassPatterns || [];

    return patterns.some((pattern: RegExp) => {
      return pattern.test(url);
    });
  }

  /**
   * Add cache-busting headers to fetch requests
   */
  enhanceFetchRequest(url: string, options: RequestInit = {}): RequestInit {
    const enhancedOptions = { ...options };

    if (this.shouldBypassCache(url)) {
      enhancedOptions.headers = {
        ...enhancedOptions.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      // Add timestamp for GET requests
      if (!enhancedOptions.method || enhancedOptions.method === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        enhancedOptions.method = 'GET';
        // Don't modify URL directly, let caller handle timestamp if needed
      }
    }

    return enhancedOptions;
  }

  /**
   * Register a URL for cache bypass
   */
  registerBypassUrl(url: string): void {
    this.bypassedUrls.add(url);
  }

  /**
   * Unregister a URL from cache bypass
   */
  unregisterBypassUrl(url: string): void {
    this.bypassedUrls.delete(url);
  }

  /**
   * Get all registered bypass URLs
   */
  getBypassedUrls(): string[] {
    return Array.from(this.bypassedUrls);
  }

  /**
   * Clear all registered bypass URLs
   */
  clearBypassUrls(): void {
    this.bypassedUrls.clear();
  }
}

// Form-specific cache bypass utilities
export class FormCacheBypass {
  static initialize(): void {
    // Intercept all form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form) {
        this.handleFormSubmission(form);
      }
    });

    // Intercept fetch requests for forms
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const cacheManager = CacheBypassManager.getInstance();
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

      if (cacheManager.shouldBypassCache(url)) {
        init = cacheManager.enhanceFetchRequest(url, init);
      }

      return originalFetch.call(this, input, init);
    };

    console.log('Form cache bypass initialized');
  }

  private static handleFormSubmission(form: HTMLFormElement): void {
    const formAction = form.action || window.location.href;
    const cacheManager = CacheBypassManager.getInstance();

    // Check if it's a form that should bypass cache
    if (cacheManager.shouldBypassCache(formAction)) {
      // Add cache-busting parameters to form data
      const timestamp = Date.now();
      const cacheBustInput = document.createElement('input');
      cacheBustInput.type = 'hidden';
      cacheBustInput.name = '_cache_bust';
      cacheBustInput.value = timestamp.toString();

      form.appendChild(cacheBustInput);

      // Add to form action URL if not already present
      if (!formAction.includes('_cache_bust=')) {
        const separator = formAction.includes('?') ? '&' : '?';
        form.action = `${formAction}${separator}_cache_bust=${timestamp}`;
      }

      console.log('Form submission cache bypass applied:', formAction);
    }
  }
}

// Analytics-specific cache bypass
export class AnalyticsCacheBypass {
  static initialize(): void {
    // Override Google Analytics sendHitTask to ensure no caching
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        'send_hit_task': 1,
        'custom_map': {
          'cache_control': 'no-cache'
        }
      });
    }

    // Override XMLHttpRequest for analytics requests
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async?: boolean, user?: string | null, password?: string | null) {
      const cacheManager = CacheBypassManager.getInstance();
      const urlString = typeof url === 'string' ? url : url.href;

      if (cacheManager.shouldBypassCache(urlString)) {
        // Add cache-busting parameter
        const separator = urlString.includes('?') ? '&' : '?';
        const newUrl = `${urlString}${separator}_cb=${Date.now()}`;

        return originalOpen.call(this, method, newUrl, async ?? true, user, password);
      }

      return originalOpen.call(this, method, url, async ?? true, user, password);
    };

    console.log('Analytics cache bypass initialized');
  }
}

// Initialize all cache bypass systems
export function initializeCacheBypass(): void {
  // Initialize form cache bypass
  FormCacheBypass.initialize();

  // Initialize analytics cache bypass
  AnalyticsCacheBypass.initialize();

  // Register common bypass URLs
  const cacheManager = CacheBypassManager.getInstance();

  // Register dynamic URLs that might be added later
  cacheManager.registerBypassUrl('/api/contact');
  cacheManager.registerBypassUrl('/api/forms');
  cacheManager.registerBypassUrl('/api/newsletter');

  console.log('Cache bypass systems initialized successfully');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCacheBypass);
} else {
  initializeCacheBypass();
}
