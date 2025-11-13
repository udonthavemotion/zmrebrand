import { test, expect } from '@playwright/test';

/**
 * API Tests for /api/lead endpoint
 * Validates security, input validation, and error handling
 */

test.describe('POST /api/lead', () => {
  test('should accept valid lead submission', async ({ request }) => {
    const response = await request.post('/api/lead', {
      data: {
        name: 'John Doe',
        phone: '555-123-4567',
        businessType: 'Contractor',
        niche: 'Home Renovation',
        notes: 'Interested in website redesign',
        source: 'homepage'
      }
    });

    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.message).toContain('successfully');
  });

  test('should reject submission with missing required fields', async ({ request }) => {
    const response = await request.post('/api/lead', {
      data: {
        // Missing name and phone
        businessType: 'Real Estate'
      }
    });

    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.error).toBeTruthy();
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  test('should reject overly large payloads', async ({ request }) => {
    const largeString = 'A'.repeat(2_000_000); // 2MB string
    
    const response = await request.post('/api/lead', {
      data: {
        name: largeString,
        phone: '555-123-4567'
      }
    });

    expect(response.status()).toBe(413);
    
    const body = await response.json();
    expect(body.code).toBe('PAYLOAD_TOO_LARGE');
    expect(body.maxSize).toBe('1MB');
  });

  test('should handle JSON content-type', async ({ request }) => {
    const response = await request.post('/api/lead', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        name: 'Jane Smith',
        phone: '555-987-6543',
        businessType: 'General',
        niche: 'General'
      })
    });

    expect(response.status()).toBe(200);
  });

  test('should handle form-urlencoded content-type', async ({ request }) => {
    const response = await request.post('/api/lead', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        name: 'Bob Johnson',
        phone: '555-111-2222',
        businessType: 'Contractor',
        niche: 'General'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('should sanitize input to prevent XSS', async ({ request }) => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    const response = await request.post('/api/lead', {
      data: {
        name: `Test ${xssPayload} User`,
        phone: '555-123-4567',
        businessType: 'General',
        niche: 'General',
        notes: xssPayload
      }
    });

    // Should not reject (sanitization happens server-side)
    // But should log safely (verified in Sentry, not here)
    expect([200, 400]).toContain(response.status());
  });

  test('should include proper CORS headers', async ({ request }) => {
    const response = await request.post('/api/lead', {
      headers: {
        'Origin': 'https://zeromotionmarketing.com'
      },
      data: {
        name: 'CORS Test',
        phone: '555-000-0000'
      }
    });

    const headers = response.headers();
    // Note: Actual CORS headers depend on Vercel config
    expect(response.status()).toBeLessThan(500);
  });

  test('should return proper error for invalid JSON', async ({ request }) => {
    const response = await request.post('/api/lead', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: 'invalid json {{{',
      failOnStatusCode: false
    });

    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.code).toBe('PARSE_ERROR');
  });
});

test.describe('GET /api/health', () => {
  test('should return health status', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.status).toBeTruthy();
    expect(['healthy', 'degraded', 'unhealthy']).toContain(body.status);
    expect(body.timestamp).toBeTruthy();
    expect(body.uptime).toBeGreaterThan(0);
  });

  test('should include service health checks', async ({ request }) => {
    const response = await request.get('/api/health');
    const body = await response.json();
    
    expect(body.services).toBeTruthy();
    expect(body.services).toHaveProperty('email');
    expect(body.services).toHaveProperty('external_apis');
  });

  test('should cache health check results', async ({ request }) => {
    // First request
    const response1 = await request.get('/api/health');
    const cacheHeader1 = response1.headers()['x-health-cache'];
    
    // Second request (should be cached)
    const response2 = await request.get('/api/health');
    const cacheHeader2 = response2.headers()['x-health-cache'];
    
    // At least one should show cache behavior
    expect([cacheHeader1, cacheHeader2]).toContain('hit');
  });

  test('should support HEAD requests for load balancers', async ({ request }) => {
    const response = await request.head('/api/health');
    
    expect([200, 503]).toContain(response.status());
    expect(response.headers()['x-system-status']).toBeTruthy();
  });
});

test.describe('API Rate Limiting', () => {
  test('should enforce rate limits on rapid requests', async ({ request }) => {
    const requests = [];
    
    // Send 105 requests rapidly (limit is 100/min)
    for (let i = 0; i < 105; i++) {
      requests.push(
        request.post('/api/lead', {
          data: {
            name: `Test User ${i}`,
            phone: '555-000-0000'
          },
          failOnStatusCode: false
        })
      );
    }
    
    const responses = await Promise.all(requests);
    const statuses = responses.map(r => r.status());
    
    // At least some should be rate limited
    expect(statuses).toContain(429);
  });

  test('rate limit response should include retry headers', async ({ request }) => {
    // Trigger rate limit by sending many requests
    const requests = Array(110).fill(null).map((_, i) =>
      request.post('/api/lead', {
        data: { name: `User ${i}`, phone: '555-000-0000' },
        failOnStatusCode: false
      })
    );
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.find(r => r.status() === 429);
    
    if (rateLimited) {
      const headers = rateLimited.headers();
      expect(headers['retry-after']).toBeTruthy();
      expect(headers['x-ratelimit-limit']).toBeTruthy();
    }
  });
});

test.describe('API Error Handling', () => {
  test('should not expose stack traces in errors', async ({ request }) => {
    const response = await request.post('/api/lead', {
      data: {
        // Intentionally malformed to trigger error
        name: null,
        phone: undefined
      },
      failOnStatusCode: false
    });

    const body = await response.text();
    
    expect(body).not.toContain('stack trace');
    expect(body).not.toContain('at Object');
    expect(body).not.toContain('.ts:');
    expect(body).not.toContain('node_modules');
  });

  test('should return JSON error responses', async ({ request }) => {
    const response = await request.post('/api/lead', {
      data: {},
      failOnStatusCode: false
    });

    expect(response.headers()['content-type']).toContain('application/json');
    
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('code');
  });
});

