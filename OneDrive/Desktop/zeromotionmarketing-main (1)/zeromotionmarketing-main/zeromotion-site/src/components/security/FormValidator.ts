/**
 * Secure Form Validation and Sanitization
 * Provides input validation, sanitization, and security measures for forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue: string;
}

export class FormValidator {
  private static readonly MAX_INPUT_LENGTH = 1000;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^\+?[\d\s\-\(\)\.]{10,15}$/;
  private static readonly NAME_REGEX = /^[a-zA-Z\s\-\'\.]{1,100}$/;
  private static readonly URL_REGEX = /^https?:\/\/[^\s<>"{}|\\^`\[\]]+$/;

  // Rate limiting storage
  private static submissions = new Map<string, { count: number; timestamp: number }>();
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private static readonly MAX_SUBMISSIONS_PER_WINDOW = 3;

  /**
   * Sanitize input by removing potentially dangerous characters
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .slice(0, this.MAX_INPUT_LENGTH)
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove script content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove potentially dangerous characters
      .replace(/[<>\"'&]/g, (char) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char] || char;
      })
      // Remove null bytes and control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  /**
   * Validate email address
   */
  static validateEmail(email: string): ValidationResult {
    const sanitized = this.sanitizeInput(email).toLowerCase();
    const errors: string[] = [];

    if (!sanitized) {
      errors.push('Email is required');
    } else if (!this.EMAIL_REGEX.test(sanitized)) {
      errors.push('Please enter a valid email address');
    } else if (sanitized.length > 254) {
      errors.push('Email address is too long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string): ValidationResult {
    const sanitized = this.sanitizeInput(phone).replace(/\s/g, '');
    const errors: string[] = [];

    if (sanitized && !this.PHONE_REGEX.test(sanitized)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate name field
   */
  static validateName(name: string): ValidationResult {
    const sanitized = this.sanitizeInput(name);
    const errors: string[] = [];

    if (!sanitized) {
      errors.push('Name is required');
    } else if (!this.NAME_REGEX.test(sanitized)) {
      errors.push('Name contains invalid characters');
    } else if (sanitized.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate URL field
   */
  static validateUrl(url: string): ValidationResult {
    const sanitized = this.sanitizeInput(url);
    const errors: string[] = [];

    if (sanitized && !this.URL_REGEX.test(sanitized)) {
      errors.push('Please enter a valid URL starting with http:// or https://');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Validate message/text area
   */
  static validateMessage(message: string): ValidationResult {
    const sanitized = this.sanitizeInput(message);
    const errors: string[] = [];

    if (sanitized.length > 2000) {
      errors.push('Message is too long (max 2000 characters)');
    }

    // Check for spam patterns
    const spamPatterns = [
      /\b(buy now|click here|free money|guaranteed)\b/gi,
      /\b(viagra|cialis|casino|lottery)\b/gi,
      /(http[s]?:\/\/[^\s]+){3,}/gi, // Multiple URLs
      /(.)\1{10,}/gi // Repeated characters
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(sanitized)) {
        errors.push('Message appears to contain spam content');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  /**
   * Check rate limiting for form submissions
   */
  static checkRateLimit(identifier: string): { allowed: boolean; timeUntilReset: number } {
    const now = Date.now();
    const key = `form_${identifier}`;
    const existing = this.submissions.get(key);

    if (!existing || now - existing.timestamp > this.RATE_LIMIT_WINDOW) {
      // Reset or create new entry
      this.submissions.set(key, { count: 1, timestamp: now });
      return { allowed: true, timeUntilReset: 0 };
    }

    if (existing.count >= this.MAX_SUBMISSIONS_PER_WINDOW) {
      const timeUntilReset = this.RATE_LIMIT_WINDOW - (now - existing.timestamp);
      return { allowed: false, timeUntilReset };
    }

    // Increment count
    existing.count++;
    return { allowed: true, timeUntilReset: 0 };
  }

  /**
   * Detect honeypot field (should remain empty)
   */
  static validateHoneypot(value: string): boolean {
    return !value || value.trim() === '';
  }

  /**
   * Generate a simple CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken && token.length === 64;
  }

  /**
   * Clean up old rate limit entries
   */
  static cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, data] of this.submissions.entries()) {
      if (now - data.timestamp > this.RATE_LIMIT_WINDOW * 2) {
        this.submissions.delete(key);
      }
    }
  }
}

// Auto-cleanup rate limits every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => FormValidator.cleanupRateLimits(), 300000);
}
