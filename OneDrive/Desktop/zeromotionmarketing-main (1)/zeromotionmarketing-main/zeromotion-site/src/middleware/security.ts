/**
 * Security Middleware for ZeroMotion Marketing
 * Handles secure cookies, rate limiting, and additional security measures
 */

import type { APIContext, MiddlewareNext } from 'astro';

interface SecurityConfig {
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
    path: string;
  };
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
  };
}

const SECURITY_CONFIG: SecurityConfig = {
  cookieOptions: {
    httpOnly: true,
    secure: true, // Only over HTTPS in production
    sameSite: 'lax',
    maxAge: 86400, // 24 hours
    path: '/'
  },
  rateLimiting: {
    windowMs: 60000, // 1 minute
    maxRequests: 100 // requests per window
  }
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Get client IP address
 */
function getClientIP(context: APIContext): string {
  const forwarded = context.request.headers.get('x-forwarded-for');
  const realIP = context.request.headers.get('x-real-ip');
  const cfIP = context.request.headers.get('cf-connecting-ip');
  
  return (
    cfIP ||
    realIP ||
    (forwarded && forwarded.split(',')[0].trim()) ||
    'unknown'
  );
}

/**
 * Rate limiting check
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `rl_${ip}`;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // Create new or reset expired entry
    const resetTime = now + SECURITY_CONFIG.rateLimiting.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: SECURITY_CONFIG.rateLimiting.maxRequests - 1,
      resetTime
    };
  }

  if (existing.count >= SECURITY_CONFIG.rateLimiting.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: SECURITY_CONFIG.rateLimiting.maxRequests - existing.count,
    resetTime: existing.resetTime
  };
}

/**
 * Set secure cookie with proper configuration
 */
function setSecureCookie(
  response: Response,
  name: string,
  value: string,
  options?: Partial<SecurityConfig['cookieOptions']>
): void {
  const cookieOptions = { ...SECURITY_CONFIG.cookieOptions, ...options };
  
  const cookieString = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${cookieOptions.path}`,
    `Max-Age=${cookieOptions.maxAge}`,
    `SameSite=${cookieOptions.sameSite}`,
    cookieOptions.httpOnly && 'HttpOnly',
    cookieOptions.secure && 'Secure'
  ].filter(Boolean).join('; ');

  response.headers.append('Set-Cookie', cookieString);
}

/**
 * Security headers middleware
 */
export function securityHeaders(response: Response, pathname: string): void {
  const headers = response.headers;
  
  // Security headers (additional to Vercel config)
  headers.set('X-Powered-By', ''); // Remove server info
  headers.set('Server', ''); // Remove server info
  
  // Additional security headers for API routes
  if (pathname.startsWith('/api/')) {
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
  }
}

/**
 * Main security middleware
 */
export async function onRequest(context: APIContext, next: MiddlewareNext) {
  const { request, url } = context;
  const ip = getClientIP(context);
  
  // Skip rate limiting for static assets
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  // Apply rate limiting
  const rateLimit = checkRateLimit(ip);
  
  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': SECURITY_CONFIG.rateLimiting.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimit.resetTime.toString()
      }
    });
  }

  // Continue with request
  const response = await next();

  // Apply security headers
  securityHeaders(response, url.pathname);

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', SECURITY_CONFIG.rateLimiting.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

  // Set secure session cookie if needed
  if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
    const sessionId = crypto.randomUUID();
    setSecureCookie(response, 'zm_session', sessionId, {
      maxAge: 3600 // 1 hour for API sessions
    });
  }

  return response;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired entries periodically (only in browser context)
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimits, 300000); // Clean up every 5 minutes
}

export { setSecureCookie, SECURITY_CONFIG };
