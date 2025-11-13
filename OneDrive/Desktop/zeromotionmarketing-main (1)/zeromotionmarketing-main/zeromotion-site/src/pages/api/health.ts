import type { APIRoute } from "astro";
import { reportServerError } from "../../../sentry.server.config.js";

/**
 * Health Check Endpoint
 * Provides comprehensive system health monitoring for uptime services and load balancers
 */

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database?: ServiceStatus;
    email?: ServiceStatus;
    external_apis?: ServiceStatus;
    filesystem?: ServiceStatus;
  };
  metrics: {
    response_time: number;
    memory_usage?: number;
    active_connections?: number;
  };
}

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  response_time?: number;
  error?: string;
  last_check: string;
}

// Store startup time for uptime calculation
const START_TIME = Date.now();
const VERSION = process.env.npm_package_version || '1.0.0';

// Cache health results to avoid excessive checks
let healthCache: HealthStatus | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Check database connectivity (placeholder - implement based on your DB)
 */
async function checkDatabase(): Promise<ServiceStatus> {
  const startTime = Date.now();

  try {
    // In a real implementation, you'd check your actual database connection
    // For now, we'll simulate a healthy database check
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate DB query time

    return {
      status: 'up',
      response_time: Date.now() - startTime,
      last_check: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Database connection failed',
      last_check: new Date().toISOString()
    };
  }
}

/**
 * Check email service connectivity
 */
async function checkEmailService(): Promise<ServiceStatus> {
  const startTime = Date.now();

  try {
    // Simple connectivity check to email service
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 'test'}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (response.ok || response.status === 401) { // 401 is expected without proper auth
      return {
        status: 'up',
        response_time: Date.now() - startTime,
        last_check: new Date().toISOString()
      };
    } else {
      return {
        status: 'degraded',
        response_time: Date.now() - startTime,
        error: `HTTP ${response.status}`,
        last_check: new Date().toISOString()
      };
    }
  } catch (error) {
    return {
      status: 'down',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Email service unreachable',
      last_check: new Date().toISOString()
    };
  }
}

/**
 * Check external API dependencies
 */
async function checkExternalAPIs(): Promise<ServiceStatus> {
  const startTime = Date.now();
  const apis = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  try {
    const checks = await Promise.allSettled(
      apis.map(api =>
        fetch(api, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        })
      )
    );

    const failedCount = checks.filter(result => result.status === 'rejected').length;

    if (failedCount === 0) {
      return {
        status: 'up',
        response_time: Date.now() - startTime,
        last_check: new Date().toISOString()
      };
    } else if (failedCount < apis.length) {
      return {
        status: 'degraded',
        response_time: Date.now() - startTime,
        error: `${failedCount}/${apis.length} external APIs unreachable`,
        last_check: new Date().toISOString()
      };
    } else {
      return {
        status: 'down',
        response_time: Date.now() - startTime,
        error: 'All external APIs unreachable',
        last_check: new Date().toISOString()
      };
    }
  } catch (error) {
    return {
      status: 'down',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'External API check failed',
      last_check: new Date().toISOString()
    };
  }
}

/**
 * Check filesystem accessibility
 */
async function checkFilesystem(): Promise<ServiceStatus> {
  const startTime = Date.now();

  try {
    // Check if we can access the file system
    const { access } = await import('node:fs/promises');
    await access('./src', require('node:fs').constants.R_OK);

    return {
      status: 'up',
      response_time: Date.now() - startTime,
      last_check: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Filesystem access failed',
      last_check: new Date().toISOString()
    };
  }
}

/**
 * Get memory usage metrics
 */
function getMemoryUsage(): { used: number; total: number; percentage: number } {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memUsage = process.memoryUsage();
    const used = memUsage.heapUsed;
    const total = memUsage.heapTotal;
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  }

  return { used: 0, total: 0, percentage: 0 };
}

/**
 * Perform comprehensive health check
 */
async function performHealthCheck(): Promise<HealthStatus> {
  const checkStartTime = Date.now();

  try {
    // Run all service checks in parallel
    const [database, email, externalAPIs, filesystem] = await Promise.all([
      checkDatabase(),
      checkEmailService(),
      checkExternalAPIs(),
      checkFilesystem()
    ]);

    // Determine overall status
    const services = { database, email, external_apis: externalAPIs, filesystem };
    const serviceStatuses = Object.values(services);

    const downServices = serviceStatuses.filter(s => s.status === 'down').length;
    const degradedServices = serviceStatuses.filter(s => s.status === 'degraded').length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (downServices > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedServices > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    // Get memory metrics
    const memory = getMemoryUsage();

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - START_TIME,
      version: VERSION,
      services,
      metrics: {
        response_time: Date.now() - checkStartTime,
        memory_usage: memory.percentage,
        active_connections: 0 // Would need to be implemented based on your server setup
      }
    };

    return healthStatus;

  } catch (error) {
    // If health check itself fails, report as unhealthy
    reportServerError(error, { context: 'health_check_failed' });

    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - START_TIME,
      version: VERSION,
      services: {
        database: { status: 'down', error: 'Health check failed', last_check: new Date().toISOString() },
        email: { status: 'down', error: 'Health check failed', last_check: new Date().toISOString() },
        external_apis: { status: 'down', error: 'Health check failed', last_check: new Date().toISOString() },
        filesystem: { status: 'down', error: 'Health check failed', last_check: new Date().toISOString() }
      },
      metrics: {
        response_time: Date.now() - checkStartTime,
        memory_usage: 0
      }
    };
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // Check cache first
    if (healthCache && Date.now() < cacheExpiry) {
      return new Response(JSON.stringify(healthCache), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30',
          'X-Health-Cache': 'hit'
        }
      });
    }

    // Perform fresh health check
    const healthStatus = await performHealthCheck();

    // Cache the result
    healthCache = healthStatus;
    cacheExpiry = Date.now() + CACHE_DURATION;

    // Determine HTTP status code based on health
    const httpStatus = healthStatus.status === 'healthy' ? 200 :
                      healthStatus.status === 'degraded' ? 200 : 503;

    return new Response(JSON.stringify(healthStatus, null, 2), {
      status: httpStatus,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
        'X-Health-Cache': 'miss',
        'X-System-Status': healthStatus.status,
        'X-Response-Time': healthStatus.metrics.response_time.toString()
      }
    });

  } catch (error) {
    reportServerError(error, { context: 'health_endpoint_error' });

    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check endpoint failed',
      uptime: Date.now() - START_TIME,
      version: VERSION
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'X-System-Status': 'unhealthy'
      }
    });
  }
};

// Support HEAD requests for load balancer health checks
export const HEAD: APIRoute = async () => {
  try {
    // Quick health check for load balancers
    const healthStatus = await performHealthCheck();

    return new Response(null, {
      status: healthStatus.status === 'healthy' ? 200 : 503,
      headers: {
        'X-System-Status': healthStatus.status,
        'X-Response-Time': healthStatus.metrics.response_time.toString()
      }
    });
  } catch (error) {
    return new Response(null, {
      status: 503,
      headers: {
        'X-System-Status': 'unhealthy'
      }
    });
  }
};
