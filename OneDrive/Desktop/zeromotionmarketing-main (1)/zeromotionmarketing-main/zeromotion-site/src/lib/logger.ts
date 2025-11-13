/**
 * Simple Logger Utility for ZeroMotion Marketing
 * Provides basic logging functionality with different levels
 */

export interface LogContext {
  [key: string]: any;
}

export class Logger {
  private static formatMessage(level: string, message: string, context?: LogContext, category?: string): string {
    const timestamp = new Date().toISOString();
    const categoryStr = category ? `[${category}]` : '';
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `${timestamp} ${level.toUpperCase()} ${categoryStr} ${message}${contextStr}`;
  }

  static info(message: string, context?: LogContext, category?: string): void {
    console.info(this.formatMessage('info', message, context, category));
  }

  static warn(message: string, context?: LogContext, category?: string): void {
    console.warn(this.formatMessage('warn', message, context, category));
  }

  static error(message: string, context?: LogContext, category?: string): void {
    console.error(this.formatMessage('error', message, context, category));
  }

  static debug(message: string, context?: LogContext, category?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context, category));
    }
  }

  static logApiError(method: string, url: string, statusCode: number, error: Error, context?: LogContext): void {
    this.error(`API Error: ${method} ${url} (${statusCode})`, {
      ...context,
      method,
      url,
      statusCode,
      error: error.message,
      stack: error.stack
    }, 'api');
  }
}

// Export singleton instance
export const logger = Logger;
