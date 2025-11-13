/**
 * Astro Middleware Configuration
 * Applies security middleware to all requests
 */

import { sequence } from 'astro:middleware';
import { onRequest as securityMiddleware } from './security';

export const onRequest = sequence(securityMiddleware);
