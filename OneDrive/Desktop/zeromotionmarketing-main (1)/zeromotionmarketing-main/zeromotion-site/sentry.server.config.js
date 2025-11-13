import * as Sentry from '@sentry/node';

/**
 * Sentry Server Configuration
 * Handles server-side error tracking and performance monitoring
 */

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

  integrations: [
    // HTTP integration for automatic instrumentation (commented out due to compatibility issues)
    // Sentry.httpIntegration({
    //   tracing: true,
    //   breadcrumbs: true,
    //   shouldCreateTransactionForRequest: (url) => {
    //     // Don't create transactions for health checks or static assets
    //     return !url.includes('/health') && !url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
    //   }
    // }),

    // GraphQL integration if needed (commented out as it's optional)
    // Sentry.graphqlIntegration(),

    // Console integration for better error context
    Sentry.consoleIntegration({
      levels: ['error', 'warn']
    }),

    // OnUncaughtException integration for better error handling
    Sentry.onUncaughtExceptionIntegration(),

    // OnUnhandledRejection integration for promise rejections
    Sentry.onUnhandledRejectionIntegration(),
  ],

  // Error filtering and sanitization
  beforeSend: function(event, hint) {
    // Sanitize sensitive data
    if (event.request?.data) {
      event.request.data = '[REDACTED]';
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
      sensitiveHeaders.forEach(header => {
        if (event.request.headers[header]) {
          event.request.headers[header] = '[REDACTED]';
        }
      });
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

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    'Non-Error promise rejection captured',
    'timeout of 0ms exceeded',
    'ECONNRESET',
    'EPIPE',
    'ENOTFOUND'
  ],

  // Custom error categorization
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
      // Categorize external API calls
      if (breadcrumb.data.url.includes('api.gohighlevel.com')) {
        breadcrumb.category = 'api-external-ghl';
      } else if (breadcrumb.data.url.includes('resend.com')) {
        breadcrumb.category = 'api-external-email';
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
    // Reduce sampling for static assets
    if (samplingContext.request?.url?.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      return 0.05;
    }
    return process.env.NODE_ENV === 'production' ? 0.1 : 1.0;
  }
});

// Custom server error reporting helper
export const reportServerError = (error, context = {}) => {
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

// API error tracking helper
export const trackApiError = (method, url, statusCode, error, context = {}) => {
  Sentry.withScope((scope) => {
    scope.setTag('api_method', method);
    scope.setTag('api_url', url);
    scope.setTag('api_status', statusCode.toString());
    scope.setTag('error_type', 'api_error');

    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });

    Sentry.captureException(error);
  });
};

// Database error tracking helper
export const trackDatabaseError = (operation, table, error, context = {}) => {
  Sentry.withScope((scope) => {
    scope.setTag('db_operation', operation);
    scope.setTag('db_table', table);
    scope.setTag('error_type', 'database_error');

    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });

    Sentry.captureException(error);
  });
};

// Email service error tracking helper
export const trackEmailError = (service, operation, error, context = {}) => {
  Sentry.withScope((scope) => {
    scope.setTag('email_service', service);
    scope.setTag('email_operation', operation);
    scope.setTag('error_type', 'email_error');

    Object.keys(context).forEach(key => {
      scope.setTag(key, context[key]);
    });

    Sentry.captureException(error);
  });
};
