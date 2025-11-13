import * as Sentry from '@sentry/browser';

/**
 * Sentry Client Configuration
 * Handles browser-side error tracking and performance monitoring
 */

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.DEV ? 'development' : 'production',

  // Performance monitoring
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,

  // Session replay
  replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Release tracking
  release: import.meta.env.PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',

  integrations: [
    // Browser tracing for performance monitoring
    Sentry.browserTracingIntegration({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/zeromotion\.marketing/
      ],
    }),

    // Session replay for error debugging
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),

    // Browser API errors integration
    Sentry.browserApiErrorsIntegration(),

    // Breadcrumbs integration for better context
    Sentry.breadcrumbsIntegration({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      sentry: true,
      xhr: true,
    }),
  ],

  // Error filtering and sanitization
  beforeSend(event, hint) {
    // Sanitize sensitive data
    if (event.request?.data) {
      event.request.data = '[REDACTED]';
    }

    // Sanitize user information
    if (event.user) {
      event.user = {
        ...event.user,
        ip_address: undefined,
        email: undefined,
        username: undefined
      };
    }

    // Filter out common non-errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'string') {
        // Filter out network errors that are expected
        if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
          return null;
        }
      }
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    'Non-Error promise rejection captured',
    'Loading chunk',
    'Script error.',
    'ResizeObserver loop limit exceeded',
    'Network Error',
    'timeout of 0ms exceeded'
  ],

  // Custom error categorization
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'fetch' && breadcrumb.data?.url) {
      // Categorize API calls
      if (breadcrumb.data.url.includes('/api/')) {
        breadcrumb.category = 'api';
      }
    }
    return breadcrumb;
  },

  // Performance monitoring configuration
  tracesSampler: (samplingContext) => {
    // Reduce sampling for health checks
    if (samplingContext.request?.url?.includes('/api/health')) {
      return 0.01;
    }
    return import.meta.env.NODE_ENV === 'production' ? 0.1 : 1.0;
  }
});

// Custom error reporting helper
export const reportError = (error, context = {}) => {
  Sentry.withScope((scope) => {
    // Add custom context
    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });

    // Set error level based on context
    if (context.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
};

// Performance tracking helper
export const trackPerformance = (name, startTime, context = {}) => {
  const duration = Date.now() - startTime;

  Sentry.withScope((scope) => {
    scope.setTag('performance', name);
    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });

    Sentry.captureMessage(`Performance: ${name}`, {
      level: 'info',
      extra: {
        duration,
        ...context
      }
    });
  });
};

// User feedback helper
export const captureUserFeedback = (message, email = '', context = {}) => {
  Sentry.captureMessage(message, {
    level: 'info',
    tags: {
      feedback: true,
      ...context
    },
    extra: {
      user_email: email
    }
  });
};
