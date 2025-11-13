/**
 * Graceful Degradation & Fallback Utilities
 * Provides fallback functionality when features fail or are unavailable
 */

import { logger } from './logger';

// Feature detection utilities
export class FeatureDetector {
  static isWebGLSupported(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl !== null;
    } catch (e) {
      return false;
    }
  }

  static isIntersectionObserverSupported(): boolean {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  }

  static isRequestIdleCallbackSupported(): boolean {
    return typeof window !== 'undefined' && 'requestIdleCallback' in window;
  }

  static isLocalStorageSupported(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

// Fallback implementations for browser APIs
export class BrowserFallbacks {
  static requestIdleCallback(callback: () => void): void {
    if (FeatureDetector.isRequestIdleCallbackSupported()) {
      window.requestIdleCallback(callback);
    } else {
      // Fallback to setTimeout with a reasonable delay
      setTimeout(callback, 200);
    }
  }

  static cancelIdleCallback(id: number): void {
    if (FeatureDetector.isRequestIdleCallbackSupported() && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(id);
    } else {
      // Fallback - clearTimeout if we stored the timeout ID
      clearTimeout(id);
    }
  }

  static createIntersectionObserver(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver | null {
    if (FeatureDetector.isIntersectionObserverSupported()) {
      return new IntersectionObserver(callback, options);
    } else {
      logger.warn('IntersectionObserver not supported, falling back to scroll events', {}, 'third_party');
      // Could implement a basic fallback using scroll events, but for now return null
      return null;
    }
  }
}

// API call wrapper with automatic retry and fallback
export class ApiFallback {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second
  private static readonly TIMEOUT = 10000; // 10 seconds

  static async fetchWithFallback<T>(
    url: string,
    options: RequestInit = {},
    fallbackData?: T
  ): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        logger.info(`API request attempt ${attempt}/${this.MAX_RETRIES}`, { url, attempt }, 'api');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        logger.logApiError(
          options.method || 'GET',
          url,
          0, // status code not available for network errors
          lastError,
          { attempt, maxRetries: this.MAX_RETRIES }
        );

        if (attempt < this.MAX_RETRIES) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        }
      }
    }

    // All retries failed
    logger.error('API request failed after all retries', {
      url,
      attempts: this.MAX_RETRIES,
      error: lastError.message
    }, 'api');

    // Return fallback data if provided
    if (fallbackData !== undefined) {
      logger.info('Returning fallback data for failed API request', { url }, 'api');
      return fallbackData;
    }

    // Re-throw the last error
    throw lastError;
  }
}

// Storage fallback with memory storage as backup
export class StorageFallback {
  private static memoryStorage = new Map<string, string>();

  static getItem(key: string): string | null {
    if (FeatureDetector.isLocalStorageSupported()) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        logger.warn('localStorage failed, falling back to memory storage', { error: error instanceof Error ? error.message : String(error) }, 'file_system');
      }
    }

    return this.memoryStorage.get(key) || null;
  }

  static setItem(key: string, value: string): void {
    if (FeatureDetector.isLocalStorageSupported()) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (error) {
        logger.warn('localStorage failed, falling back to memory storage', { error: error instanceof Error ? error.message : String(error) }, 'file_system');
      }
    }

    this.memoryStorage.set(key, value);
  }

  static removeItem(key: string): void {
    if (FeatureDetector.isLocalStorageSupported()) {
      try {
        localStorage.removeItem(key);
        return;
      } catch (error) {
        logger.warn('localStorage failed, falling back to memory storage', { error: error instanceof Error ? error.message : String(error) }, 'file_system');
      }
    }

    this.memoryStorage.delete(key);
  }

  static clear(): void {
    if (FeatureDetector.isLocalStorageSupported()) {
      try {
        localStorage.clear();
        return;
      } catch (error) {
        logger.warn('localStorage failed, falling back to memory storage', { error: error instanceof Error ? error.message : String(error) }, 'file_system');
      }
    }

    this.memoryStorage.clear();
  }
}

// JavaScript loading and execution fallbacks
export class JSFallbacks {
  private static loadedScripts = new Set<string>();

  static async loadScript(src: string, options: {
    async?: boolean;
    defer?: boolean;
    integrity?: string;
    crossOrigin?: string;
    fallback?: () => void;
  } = {}): Promise<void> {
    const {
      async = true,
      defer = false,
      integrity,
      crossOrigin,
      fallback
    } = options;

    // Check if already loaded
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = async;
      script.defer = defer;

      if (integrity) script.integrity = integrity;
      if (crossOrigin) script.crossOrigin = crossOrigin;

      script.onload = () => {
        this.loadedScripts.add(src);
        logger.info('Script loaded successfully', { src }, 'system');
        resolve();
      };

      script.onerror = (error) => {
        logger.error('Script failed to load', { src, error: error.toString() }, 'system');

        // Try fallback if provided
        if (fallback) {
          logger.info('Executing fallback for failed script', { src }, 'system');
          try {
            fallback();
            resolve();
          } catch (fallbackError) {
            reject(fallbackError);
          }
        } else {
          reject(new Error(`Failed to load script: ${src}`));
        }
      };

      document.head.appendChild(script);
    });
  }

  static async loadCSS(href: string, options: {
    media?: string;
    fallback?: () => void;
  } = {}): Promise<void> {
    const { media = 'all', fallback } = options;

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = media;

      link.onload = () => {
        logger.info('CSS loaded successfully', { href }, 'system');
        resolve();
      };

      link.onerror = (error) => {
        logger.error('CSS failed to load', { href, error: error.toString() }, 'system');

        if (fallback) {
          try {
            fallback();
            resolve();
          } catch (fallbackError) {
            reject(fallbackError);
          }
        } else {
          reject(new Error(`Failed to load CSS: ${href}`));
        }
      };

      document.head.appendChild(link);
    });
  }
}

// Animation and visual effect fallbacks
export class AnimationFallbacks {
  static getAnimationFunction(): ((element: Element, className: string) => void) {
    // Check for modern animation APIs
    if (typeof window !== 'undefined' && 'Animation' in window) {
      return (element: Element, className: string) => {
        element.classList.add(className);
      };
    }

    // Fallback to basic class manipulation
    return (element: Element, className: string) => {
      element.classList.add(className);
      // Force reflow for older browsers
      (element as HTMLElement).offsetHeight;
    };
  }

  static createSmoothScroll(target: Element, options: ScrollIntoViewOptions = {}): void {
    if ('scrollBehavior' in document.documentElement.style) {
      target.scrollIntoView({ behavior: 'smooth', ...options });
    } else {
      // Fallback for browsers without smooth scrolling
      target.scrollIntoView(options);
    }
  }
}

// Network status monitoring and offline fallbacks
export class NetworkFallbacks {
  private static isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private static listeners: ((online: boolean) => void)[] = [];

  static init(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      logger.info('Network connection restored', {}, 'network');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
      logger.warn('Network connection lost', {}, 'network');
    });
  }

  static onNetworkChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  static isOnlineStatus(): boolean {
    return this.isOnline;
  }

  private static notifyListeners(online: boolean): void {
    this.listeners.forEach(callback => {
      try {
        callback(online);
      } catch (error) {
        logger.error('Error in network change listener', { error: error instanceof Error ? error.message : String(error) }, 'system');
      }
    });
  }

  static async fetchWithOfflineFallback<T>(
    url: string,
    options: RequestInit = {},
    offlineFallback?: T
  ): Promise<T> {
    if (!this.isOnline && offlineFallback !== undefined) {
      logger.info('Using offline fallback for API request', { url }, 'network');
      return offlineFallback;
    }

    return ApiFallback.fetchWithFallback(url, options, offlineFallback);
  }
}

// Initialize network monitoring
if (typeof window !== 'undefined') {
  NetworkFallbacks.init();
}
