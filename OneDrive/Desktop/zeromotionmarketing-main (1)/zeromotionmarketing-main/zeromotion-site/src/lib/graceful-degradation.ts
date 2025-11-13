/**
 * Graceful Degradation Manager
 * Manages fallback behavior when features fail or are unavailable
 */

import { logger } from './logger';
import { FeatureDetector, BrowserFallbacks, ApiFallback, StorageFallback, JSFallbacks, AnimationFallbacks, NetworkFallbacks } from './fallbacks';

interface DegradationConfig {
  showWarnings: boolean;
  enableOfflineMode: boolean;
  retryFailedRequests: boolean;
  fallbackUIEnabled: boolean;
}

export class GracefulDegradationManager {
  private static instance: GracefulDegradationManager;
  private config: DegradationConfig;
  private degradedFeatures = new Set<string>();
  private recoveryAttempts = new Map<string, number>();

  private constructor() {
    this.config = {
      showWarnings: true,
      enableOfflineMode: true,
      retryFailedRequests: true,
      fallbackUIEnabled: true
    };

    this.init();
  }

  static getInstance(): GracefulDegradationManager {
    if (!GracefulDegradationManager.instance) {
      GracefulDegradationManager.instance = new GracefulDegradationManager();
    }
    return GracefulDegradationManager.instance;
  }

  private init(): void {
    // Check for degraded features on initialization
    this.checkFeatureSupport();

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Monitor network status
    this.setupNetworkMonitoring();
  }

  private checkFeatureSupport(): void {
    const features = [
      { name: 'webgl', supported: FeatureDetector.isWebGLSupported(), showWarning: true },
      { name: 'intersectionObserver', supported: FeatureDetector.isIntersectionObserverSupported(), showWarning: false },
      { name: 'requestIdleCallback', supported: FeatureDetector.isRequestIdleCallbackSupported(), showWarning: false },
      { name: 'localStorage', supported: FeatureDetector.isLocalStorageSupported(), showWarning: false }
    ];

    features.forEach(({ name, supported, showWarning }) => {
      if (!supported) {
        this.markFeatureDegraded(name, `Feature not supported: ${name}`, showWarning);
      }
    });

    // Check for reduced motion preference (don't show warning for this)
    if (FeatureDetector.prefersReducedMotion()) {
      this.markFeatureDegraded('animations', 'User prefers reduced motion', false);
    }
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', {
          reason: event.reason,
          promise: event.promise.toString()
        }, 'system');

        // Prevent default browser error handling for promise rejections
        event.preventDefault();

        this.handleGenericError('unhandled_promise_rejection', event.reason);
      });

      // Handle global JavaScript errors
      window.addEventListener('error', (event) => {
        logger.error('Global JavaScript error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.toString()
        }, 'system');

        this.handleGenericError('javascript_error', event.error);
      });

      // Handle WebGL context loss
      window.addEventListener('webglcontextlost', (event) => {
        logger.warn('WebGL context lost', {}, 'third_party');
        this.markFeatureDegraded('webgl', 'WebGL context lost');
        event.preventDefault();
      });

      // Handle WebGL context restoration
      window.addEventListener('webglcontextrestored', (event) => {
        logger.info('WebGL context restored', {}, 'third_party');
        this.restoreFeature('webgl');
      });
    }
  }

  private setupNetworkMonitoring(): void {
    const unsubscribe = NetworkFallbacks.onNetworkChange((online) => {
      if (online) {
        this.handleNetworkRestored();
      } else {
        this.handleNetworkLost();
      }
    });

    // Store unsubscribe function for cleanup if needed
    this.recoveryAttempts.set('network_monitor', unsubscribe as any);
  }

  markFeatureDegraded(feature: string, reason: string, showWarning = true): void {
    if (!this.degradedFeatures.has(feature)) {
      this.degradedFeatures.add(feature);

      logger.warn(`Feature marked as degraded: ${feature}`, {
        reason,
        degradedFeatures: Array.from(this.degradedFeatures)
      }, 'system');

      // Show user warning if enabled and warning is requested
      if (this.config.showWarnings && showWarning) {
        this.showUserWarning(`Some features may not work properly: ${reason}`);
      }

      // Trigger fallback behavior
      this.activateFallbackForFeature(feature);
    }
  }

  restoreFeature(feature: string): void {
    if (this.degradedFeatures.has(feature)) {
      this.degradedFeatures.delete(feature);

      logger.info(`Feature restored: ${feature}`, {
        remainingDegradedFeatures: Array.from(this.degradedFeatures)
      }, 'system');

      // Hide user warning if no more degraded features
      if (this.degradedFeatures.size === 0) {
        this.hideUserWarnings();
      }

      // Trigger recovery behavior
      this.deactivateFallbackForFeature(feature);
    }
  }

  private activateFallbackForFeature(feature: string): void {
    switch (feature) {
      case 'webgl':
        this.enableWebGLFallback();
        break;
      case 'intersectionObserver':
        this.enableIntersectionObserverFallback();
        break;
      case 'animations':
        this.disableAnimations();
        break;
      case 'localStorage':
        this.enableStorageFallback();
        break;
    }
  }

  private deactivateFallbackForFeature(feature: string): void {
    switch (feature) {
      case 'webgl':
        this.disableWebGLFallback();
        break;
      case 'intersectionObserver':
        this.disableIntersectionObserverFallback();
        break;
      case 'animations':
        this.enableAnimations();
        break;
      case 'localStorage':
        this.disableStorageFallback();
        break;
    }
  }

  private enableWebGLFallback(): void {
    // Add CSS class to enable WebGL fallbacks
    document.documentElement.classList.add('webgl-disabled');
    logger.info('WebGL fallback activated', {}, 'third_party');
  }

  private disableWebGLFallback(): void {
    document.documentElement.classList.remove('webgl-disabled');
    logger.info('WebGL fallback deactivated', {}, 'third_party');
  }

  private enableIntersectionObserverFallback(): void {
    // Implement scroll-based fallback for intersection detection
    logger.info('IntersectionObserver fallback activated', {}, 'third_party');
  }

  private disableIntersectionObserverFallback(): void {
    logger.info('IntersectionObserver fallback deactivated', {}, 'third_party');
  }

  private disableAnimations(): void {
    document.documentElement.classList.add('reduced-motion');
    logger.info('Animations disabled for accessibility', {}, 'user_action');
  }

  private enableAnimations(): void {
    document.documentElement.classList.remove('reduced-motion');
    logger.info('Animations re-enabled', {}, 'user_action');
  }

  private enableStorageFallback(): void {
    logger.info('Storage fallback activated', {}, 'file_system');
  }

  private disableStorageFallback(): void {
    logger.info('Storage fallback deactivated', {}, 'file_system');
  }

  private handleNetworkLost(): void {
    this.markFeatureDegraded('network', 'Network connection lost');
    this.showNetworkStatus(false);
  }

  private handleNetworkRestored(): void {
    this.restoreFeature('network');
    this.showNetworkStatus(true);

    // Attempt to recover failed features
    this.attemptRecovery();
  }

  private showNetworkStatus(online: boolean): void {
    const statusElement = document.getElementById('network-status');
    if (statusElement) {
      statusElement.textContent = online ? 'Online' : 'Offline';
      statusElement.className = online ? 'network-online' : 'network-offline';
    }
  }

  private attemptRecovery(): void {
    // Attempt to recover degraded features
    const featuresToRecover = Array.from(this.degradedFeatures);

    featuresToRecover.forEach(feature => {
      const attempts = this.recoveryAttempts.get(feature) || 0;

      if (attempts < 3) {
        this.recoveryAttempts.set(feature, attempts + 1);

        // Attempt recovery based on feature type
        switch (feature) {
          case 'webgl':
            if (FeatureDetector.isWebGLSupported()) {
              this.restoreFeature(feature);
            }
            break;
          case 'intersectionObserver':
            if (FeatureDetector.isIntersectionObserverSupported()) {
              this.restoreFeature(feature);
            }
            break;
          case 'localStorage':
            if (FeatureDetector.isLocalStorageSupported()) {
              this.restoreFeature(feature);
            }
            break;
        }
      }
    });
  }

  private handleGenericError(type: string, error: any): void {
    logger.error(`Generic error handled: ${type}`, {
      error: error?.message || String(error),
      type
    }, 'system');

    // Show user-friendly error message
    if (this.config.fallbackUIEnabled) {
      this.showErrorNotification('An unexpected error occurred. Please refresh the page if issues persist.');
    }
  }

  private showUserWarning(message: string): void {
    const warningElement = document.getElementById('user-warnings');
    if (warningElement) {
      const warning = document.createElement('div');
      warning.className = 'user-warning';
      warning.textContent = message;
      warningElement.appendChild(warning);

      // Auto-remove after 10 seconds
      setTimeout(() => {
        warning.remove();
      }, 10000);
    }
  }

  private hideUserWarnings(): void {
    const warningElement = document.getElementById('user-warnings');
    if (warningElement) {
      warningElement.innerHTML = '';
    }
  }

  private showErrorNotification(message: string): void {
    const notificationElement = document.getElementById('error-notifications');
    if (notificationElement) {
      const notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.innerHTML = `
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-message">${message}</span>
          <button class="error-dismiss" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `;
      notificationElement.appendChild(notification);

      // Auto-remove after 15 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 15000);
    }
  }

  // Public API methods
  isFeatureDegraded(feature: string): boolean {
    return this.degradedFeatures.has(feature);
  }

  getDegradedFeatures(): string[] {
    return Array.from(this.degradedFeatures);
  }

  updateConfig(newConfig: Partial<DegradationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('Graceful degradation config updated', newConfig, 'system');
  }

  forceRecovery(feature?: string): void {
    if (feature) {
      this.restoreFeature(feature);
    } else {
      // Attempt to recover all degraded features
      const features = Array.from(this.degradedFeatures);
      features.forEach(f => this.attemptRecoveryForFeature(f));
    }
  }

  private attemptRecoveryForFeature(feature: string): void {
    // Reset recovery attempts for this feature
    this.recoveryAttempts.set(feature, 0);
    this.attemptRecovery();
  }

  // Utility methods for common operations
  async safeFetch<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
    try {
      if (this.config.retryFailedRequests) {
        return await ApiFallback.fetchWithFallback(url, options, fallback);
      } else {
        const response = await fetch(url, options);
        return await response.json();
      }
    } catch (error) {
      logger.logApiError('GET', url, 0, error as Error);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  }

  safeStorageGet(key: string): string | null {
    return StorageFallback.getItem(key);
  }

  safeStorageSet(key: string, value: string): void {
    StorageFallback.setItem(key, value);
  }

  safeAnimation(element: Element, className: string): void {
    const animate = AnimationFallbacks.getAnimationFunction();
    animate(element, className);
  }
}

// Global instance
export const gracefulDegradation = GracefulDegradationManager.getInstance();

// Export convenience functions
export const isFeatureDegraded = (feature: string) => gracefulDegradation.isFeatureDegraded(feature);
export const getDegradedFeatures = () => gracefulDegradation.getDegradedFeatures();
export const safeFetch = (url: string, options?: RequestInit, fallback?: any) =>
  gracefulDegradation.safeFetch(url, options, fallback);
export const safeStorageGet = (key: string) => gracefulDegradation.safeStorageGet(key);
export const safeStorageSet = (key: string, value: string) => gracefulDegradation.safeStorageSet(key, value);
export const safeAnimation = (element: Element, className: string) =>
  gracefulDegradation.safeAnimation(element, className);
