/// <reference path="../env.d.ts" />

/**
 * Enhanced Production-Safe Logger
 * Provides structured logging, error categorization, and monitoring integration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  category?: LogCategory;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  url?: string;
  ip?: string;
  stackTrace?: string;
  tags?: string[];
}

type LogCategory =
  | 'auth'
  | 'api'
  | 'database'
  | 'email'
  | 'file_system'
  | 'network'
  | 'validation'
  | 'performance'
  | 'security'
  | 'user_action'
  | 'system'
  | 'third_party';

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;
  private sessionId = this.generateSessionId();
  private logsBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    category?: LogCategory,
    tags?: string[]
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context || {},
      category,
      tags,
      sessionId: this.sessionId
    };

    // Add client-side context if available
    if (typeof window !== 'undefined') {
      entry.userAgent = navigator.userAgent;
      entry.url = window.location.href;
    }

    // Add error stack trace for errors
    if (level === 'error' || level === 'critical') {
      const error = new Error();
      entry.stackTrace = error.stack;
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;

    // In production, only log warn, error, and critical
    return ['warn', 'error', 'critical'].includes(level);
  }

  // Core logging methods with enhanced features
  debug(message: string, context?: Record<string, any>, category?: LogCategory, tags?: string[]): void {
    if (!this.shouldLog('debug')) return;

    const entry = this.formatMessage('debug', message, context, category, tags);
    this.bufferLog(entry);

    if (this.isDevelopment) {
      console.debug('[DEBUG]', message, { ...context, category, tags });
    }
  }

  info(message: string, context?: Record<string, any>, category?: LogCategory, tags?: string[]): void {
    if (!this.shouldLog('info')) return;

    const entry = this.formatMessage('info', message, context, category, tags);
    this.bufferLog(entry);

    if (this.isDevelopment) {
      console.info('[INFO]', message, { ...context, category, tags });
    }

    if (this.isProduction) {
      this.sendToMonitoring('info', message, { ...context, category, tags });
    }
  }

  warn(message: string, context?: Record<string, any>, category?: LogCategory, tags?: string[]): void {
    if (!this.shouldLog('warn')) return;

    const entry = this.formatMessage('warn', message, context, category, tags);
    this.bufferLog(entry);

    if (this.isDevelopment) {
      console.warn('[WARN]', message, { ...context, category, tags });
    }

    if (this.isProduction) {
      this.sendToMonitoring('warn', message, { ...context, category, tags });
    }
  }

  error(message: string, context?: Record<string, any>, category?: LogCategory, tags?: string[]): void {
    if (!this.shouldLog('error')) return;

    const entry = this.formatMessage('error', message, context, category, tags);
    this.bufferLog(entry);

    if (this.isDevelopment) {
      console.error('[ERROR]', message, { ...context, category, tags });
    }

    if (this.isProduction) {
      this.sendToMonitoring('error', message, { ...context, category, tags });
    }
  }

  critical(message: string, context?: Record<string, any>, category?: LogCategory, tags?: string[]): void {
    const entry = this.formatMessage('critical', message, context, category, tags);
    this.bufferLog(entry);

    // Always log critical errors
    console.error('[CRITICAL]', message, { ...context, category, tags });

    if (this.isProduction) {
      this.sendToMonitoring('critical', message, { ...context, category, tags });
    }
  }

  // Category-specific logging methods
  logApiError(method: string, url: string, statusCode: number, error: Error, context?: Record<string, any>): void {
    this.error(`API Error: ${method} ${url}`, {
      ...context,
      method,
      url,
      statusCode,
      error: error.message,
      stack: error.stack
    }, 'api', ['api_error', `status_${statusCode}`]);
  }

  logAuthEvent(event: string, userId?: string, context?: Record<string, any>): void {
    this.info(`Auth Event: ${event}`, {
      ...context,
      userId,
      event
    }, 'auth', ['auth', event]);
  }

  logSecurityIncident(type: string, details: Record<string, any>): void {
    this.critical(`Security Incident: ${type}`, details, 'security', ['security', 'incident', type]);
  }

  logPerformanceMetric(name: string, value: number, context?: Record<string, any>): void {
    this.info(`Performance: ${name}`, {
      ...context,
      metric: name,
      value,
      unit: context?.unit || 'ms'
    }, 'performance', ['performance', name]);
  }

  logUserAction(action: string, userId?: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      ...context,
      userId,
      action
    }, 'user_action', ['user_action', action]);
  }

  logValidationError(field: string, value: any, error: string, context?: Record<string, any>): void {
    this.warn(`Validation Error: ${field}`, {
      ...context,
      field,
      value: this.sanitizeValue(value),
      error
    }, 'validation', ['validation', field]);
  }

  private bufferLog(entry: LogEntry): void {
    this.logsBuffer.push(entry);

    // Maintain buffer size
    if (this.logsBuffer.length > this.maxBufferSize) {
      this.logsBuffer.shift();
    }

    // Flush buffer periodically in production
    if (this.isProduction && this.logsBuffer.length >= 10) {
      this.flushLogs();
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.logsBuffer.length === 0) return;

    try {
      // In a real implementation, you'd send logs to your logging service
      // For now, we'll batch them for monitoring services
      const logsToFlush = [...this.logsBuffer];
      this.logsBuffer = [];

      // Send critical and error logs immediately
      const criticalLogs = logsToFlush.filter(log => ['critical', 'error'].includes(log.level));

      if (criticalLogs.length > 0 && typeof window !== 'undefined') {
        // Send to Google Analytics for immediate visibility
        criticalLogs.forEach(log => {
          (window as any).gtag?.('event', 'exception', {
            description: log.message,
            fatal: log.level === 'critical',
            custom_map: {
              category: log.category,
              tags: log.tags?.join(','),
              session_id: log.sessionId
            }
          });
        });
      }

    } catch (error) {
      // Fail silently - logging should never break the app
      console.error('Failed to flush logs:', error);
    }
  }

  private sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      // Remove sensitive patterns
      return value.replace(/\b(password|token|api[_-]?key|secret|auth)\s*[:=]\s*\S+/gi, '$1: [REDACTED]');
    }
    return value;
  }

  private sendToMonitoring(level: LogLevel, message: string, context?: Record<string, any>): void {
    // In production, send to your monitoring service (e.g., Sentry, LogRocket, etc.)
    // For now, we'll use a secure approach that doesn't expose sensitive data

    try {
      const logEntry = this.formatMessage(level, message, context);

      // Remove sensitive data before logging
      const sanitizedContext = this.sanitizeContext(logEntry.context);

      // Send to monitoring service (implement based on your monitoring solution)
      // Example: Sentry, LogRocket, DataDog, etc.
      if (typeof window !== 'undefined' && (level === 'error' || level === 'critical')) {
        // Client-side error reporting
        (window as any).gtag?.('event', 'exception', {
          description: message,
          fatal: level === 'critical',
          custom_map: {
            category: logEntry.category,
            tags: logEntry.tags?.join(','),
            session_id: logEntry.sessionId
          }
        });
      }
    } catch (error) {
      // Fail silently in production - never break the app due to logging
    }
  }

  private sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context) return undefined;

    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ['password', 'token', 'api_key', 'secret', 'auth', 'session'];

    for (const [key, value] of Object.entries(context)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey));

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 1000) {
        sanitized[key] = value.substring(0, 1000) + '...[TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // Public utility methods
  public getLogs(level?: LogLevel, category?: LogCategory): LogEntry[] {
    return this.logsBuffer.filter(log => {
      if (level && log.level !== level) return false;
      if (category && log.category !== category) return false;
      return true;
    });
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public clearLogs(): void {
    this.logsBuffer = [];
  }

  public async flush(): Promise<void> {
    await this.flushLogs();
  }

  // Performance tracking
  public startTimer(label: string): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.logPerformanceMetric(label, duration, { type: 'timer' });
    };
  }

  // Error tracking with context
  public trackError(error: Error, context?: Record<string, any>, category?: LogCategory): void {
    this.error(error.message, {
      ...context,
      stack: error.stack,
      name: error.name
    }, category, ['tracked_error']);
  }
}

// Export singleton instance
export const logger = new Logger();

// Enhanced production console override
if (import.meta.env.PROD) {
  // Override console methods to use our logger
  const originalConsole = { ...console };

  console.log = (...args) => {
    logger.info(args.join(' '), {}, 'system');
  };

  console.debug = (...args) => {
    logger.debug(args.join(' '), {}, 'system');
  };

  console.info = (...args) => {
    logger.info(args.join(' '), {}, 'system');
  };

  console.warn = (...args) => {
    logger.warn(args.join(' '), {}, 'system');
  };

  console.error = (...args) => {
    const message = args.join(' ');
    const sanitizedArgs = args.map(arg => {
      if (typeof arg === 'string') {
        return arg.replace(/\b(password|token|api[_-]?key|secret|auth)\s*[:=]\s*\S+/gi, '$1: [REDACTED]');
      }
      return arg;
    });

    // Use our enhanced error logging
    logger.error(sanitizedArgs.join(' '), {
      originalArgs: sanitizedArgs,
      stack: new Error().stack
    }, 'system');

    // Still call original for critical system errors
    originalConsole.error(...sanitizedArgs);
  };
}
