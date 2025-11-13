# ZeroMotion Marketing - Pre-Launch Security & Performance Audit
**Audit Date:** October 21, 2025  
**Auditor:** Senior Full-Stack Engineer & Security Auditor  
**Target:** https://www.zeromotionmarketing.com (Vercel Production)

---

## EXECUTIVE SUMMARY

**VERDICT: ⚠️ CONDITIONAL GO with Critical Fixes Required**

The ZeroMotion Marketing site demonstrates **strong foundational security** with comprehensive middleware, rate limiting, Sentry integration, and proper HTTPS enforcement. However, **5 critical security issues** must be resolved before production launch to meet OWASP ASVS Level 2 compliance and prevent potential data exposure.

### Top 5 Risks (Blocking Issues)

1. **🔴 CRITICAL: CSP Allows 'unsafe-inline' and 'unsafe-eval'** (OWASP A05:2021)
   - **Impact:** XSS attacks possible; violates modern CSP best practices
   - **Effort:** 2-3 hours
   - **Fix:** Migrate to nonce-based CSP, remove unsafe directives

2. **🔴 CRITICAL: Missing .env.example File** (OWASP A05:2021, CWE-209)
   - **Impact:** Developers may expose secrets; no environment variable documentation
   - **Effort:** 30 minutes
   - **Fix:** Create comprehensive .env.example with all required variables

3. **🟠 HIGH: GHL Iframe Lacks SRI/Integrity Checks** (OWASP A08:2021)
   - **Impact:** Supply chain attack vector via compromised third-party script
   - **Effort:** 1 hour
   - **Fix:** Add Subresource Integrity to GHL form embed script

4. **🟠 HIGH: API /api/lead Missing Request Size Limits** (OWASP A04:2021, CWE-400)
   - **Impact:** DoS via large payload attacks
   - **Effort:** 1 hour
   - **Fix:** Implement content-length validation middleware

5. **🟠 HIGH: Insufficient Playwright Test Coverage** (OWASP ASVS V7)
   - **Impact:** Untested critical paths (contact form, API routes, error states)
   - **Effort:** 4 hours
   - **Fix:** Add smoke tests for all user journeys and API endpoints

### Strengths Identified ✅
- **Excellent** Sentry configuration with PII scrubbing
- **Strong** rate limiting (100 req/min with IP-based tracking)
- **Robust** form validation with XSS/injection protection
- **Comprehensive** CAN-SPAM compliance in email system
- **Good** security headers foundation (HSTS, X-Frame-Options, etc.)
- **Modern** Astro 5.x + Vite with proper TypeScript config
- **Performant** asset caching strategy with immutable headers

---

## RISK MATRIX

| # | Severity | Area | Finding | File/Line | Impact | Likelihood | Effort | Status |
|---|----------|------|---------|-----------|--------|------------|--------|--------|
| 1 | 🔴 Critical | AppSec | CSP allows 'unsafe-inline', 'unsafe-eval' | vercel.json:36 | XSS attacks possible | High | 2-3h | **MUST FIX** |
| 2 | 🔴 Critical | Config | Missing .env.example | - | Secret exposure risk | Medium | 30m | **MUST FIX** |
| 3 | 🟠 High | Third-Party | GHL script lacks SRI | Contact.astro:35 | Supply chain attack | Medium | 1h | **MUST FIX** |
| 4 | 🟠 High | API Security | No request size limit on /api/lead | api/lead.ts:7 | DoS via large payloads | High | 1h | **MUST FIX** |
| 5 | 🟠 High | Testing | Insufficient test coverage | tests/ | Regression risks | Medium | 4h | **MUST FIX** |
| 6 | 🟡 Medium | CSRF | No CSRF tokens in API routes | api/lead.ts | CSRF attacks possible | Low | 2h | Recommended |
| 7 | 🟡 Medium | Performance | Fonts not self-hosted | BaseLayout.astro | GDPR/privacy, SPOF | Low | 1h | Recommended |
| 8 | 🟡 Medium | Monitoring | No uptime/alert config documented | - | Delayed incident response | Medium | 1h | Recommended |
| 9 | 🟢 Low | Dependencies | Some packages outdated | package.json | Potential vulnerabilities | Low | 30m | Optional |
| 10 | 🟢 Low | SEO | No sitemap validation script | - | Broken links undetected | Low | 30m | Optional |

---

## STEP 1: REPO & DEPENDENCY TRIAGE

### Dependency Health Table

| Package | Current | Latest | Risk | Action |
|---------|---------|--------|------|--------|
| astro | 5.12.9 | ✅ Latest | ✅ None | - |
| @astrojs/vercel | 8.2.5 | ✅ Latest | ✅ None | - |
| @astrojs/react | 4.3.0 | ✅ Latest | ✅ None | - |
| @sentry/astro | 10.10.0 | ⚠️ 10.11.x | 🟡 Minor update available | Update recommended |
| react | 19.1.1 | ✅ Latest | ✅ None | - |
| tailwindcss | 4.1.11 | ✅ Latest | ✅ None | - |
| typescript | 5.9.2 | ⚠️ 5.9.3 | 🟡 Patch available | Update recommended |
| zod | 3.25.76 | ✅ Latest | ✅ None | - |
| resend | 6.0.1 | ⚠️ 6.1.x | 🟡 Minor update available | Update recommended |
| @playwright/test | 1.47.2 | ⚠️ 1.48.x | 🟡 Minor update available | Update recommended |
| three | 0.179.1 | ⚠️ 0.180.x | 🟡 Minor update available | Update recommended (non-critical) |

**Build Health:** ✅ PASS (no type errors detected, Vite config valid)  
**Adapter:** ✅ @astrojs/vercel configured correctly for serverless  
**Node Version:** ✅ Implied 18.x+ (matches Vercel defaults)  
**Package Manager:** ✅ pnpm@10.14.0 with lockfile present

**Recommendation:** Run `pnpm update` to pull minor/patch updates. No breaking changes expected.

---

## STEP 2: CONFIGURATION & BUILD HYGIENE

### Astro Config Review (astro.config.mjs)

✅ **Correct:**
- `output: "server"` for API routes
- `adapter: vercel()` with Web Analytics + Speed Insights enabled
- Image optimization configured (webp, avif, quality: 85)
- `build.split: true` for chunk splitting
- Asset versioning with content hashes
- Source maps disabled for production (`sourcemap: false`)
- Manual chunks defined for vendor splitting

⚠️ **Issues:**
- **MEDIUM:** `checkOrigin: true` is good but insufficient for full CSRF protection
- **LOW:** Sentry DSN exposed via `process.env.SENTRY_DSN` (client-side should use PUBLIC_ prefix)

### TSConfig Review (tsconfig.json)

✅ **Correct:**
- Extends `astro/tsconfigs/strict`
- React JSX configured properly
- `skipLibCheck: true` for faster builds

### Vercel.json Review

✅ **Strong Headers:**
- HSTS with preload (max-age=31536000)
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictive
- Cross-Origin-Resource-Policy: same-site

🔴 **CRITICAL Issues:**
1. **CSP allows 'unsafe-inline' and 'unsafe-eval'** (Line 36)
   ```
   script-src 'self' 'unsafe-inline' 'unsafe-eval' https://...
   ```
   **Impact:** Defeats CSP protection against XSS
   **Fix Required:** Migrate to nonce-based CSP

2. **Missing upgrade-insecure-requests directive**
   **Impact:** HTTP resources may be loaded over insecure connections

### PostCSS Config Review (postcss.config.js)

✅ **Correct:**
- PurgeCSS temporarily disabled (noted in TODO)
- cssnano with safe defaults in production
- Preserves important CSS features (calc, keyframes, z-index)

---

## STEP 3: ROUTING, MIDDLEWARE, AND SERVER CODE

### Middleware Review (src/middleware/)

✅ **Excellent Implementation:**
- Rate limiting: 100 req/min per IP with sliding window
- Secure cookie generation with proper flags (HttpOnly, Secure, SameSite=lax)
- Client IP detection via x-forwarded-for, x-real-ip, cf-connecting-ip
- Security headers applied to all responses
- Rate limit headers added (X-RateLimit-*)
- Static asset bypass for rate limiting

⚠️ **Potential Issues:**
1. **MEDIUM:** In-memory rate limit storage won't scale across serverless instances
   - **Recommendation:** Use Vercel Edge Config or external Redis for production
   
2. **LOW:** Rate limit cleanup runs client-side (`typeof window !== 'undefined'`)
   - **Impact:** Cleanup won't run in serverless environment
   - **Fix:** Remove client-side check or implement server-side cleanup

### API Routes Review

#### /api/health.ts

✅ **Strengths:**
- Comprehensive health checks (database, email, external APIs, filesystem)
- Caching with 30s TTL
- Proper HTTP status codes (200/503 based on health)
- Sentry error tracking

⚠️ **Issues:**
- **LOW:** Database check is simulated (not connected to real DB)
- **LOW:** Email service check exposes Resend API structure

#### /api/lead.ts

✅ **Strengths:**
- Multiple content-type support (JSON, form-data)
- Input validation for required fields
- Sentry error tracking with context
- Development-only file storage

🔴 **CRITICAL Issues:**
1. **No request size limit**
   ```typescript
   // Line 7-22: Unrestricted request parsing
   const data = await request.json();
   ```
   **Impact:** DoS via 100MB+ payloads
   **Fix Required:** Add Content-Length validation

2. **No CSRF protection**
   **Impact:** Cross-site request forgery possible
   **Likelihood:** Low (no authentication, but still exploitable)

3. **Missing rate limiting specific to this endpoint**
   - Global rate limit (100/min) may be too lenient for form submissions

⚠️ **MEDIUM Issues:**
- **No honeypot field validation** (FormValidator has honeypot method but not used)
- **Email validation missing** on server-side (accepts empty email: `email: ""`)

### Error Handling Review (404.astro, 500.astro)

✅ **Correct:**
- Custom error pages exist
- No stack traces or internal details exposed (based on file change history)

---

## STEP 4: GHL INTEGRATION REVIEW (CRITICAL)

### GoHighLevel Form Analysis

**Location:** `src/components/Contact.astro:18-35`

```html
<iframe src="https://link.zeromotionmarketing.com/widget/form/vSs75oKjAPcQGOAT8xOK" ...></iframe>
<script src="https://link.zeromotionmarketing.com/js/form_embed.js"></script>
```

✅ **Correct:**
- iframe sandbox implied by GHL
- loading="lazy" for performance
- allowtransparency="true" for styling

🟠 **HIGH RISK:**
1. **No Subresource Integrity (SRI) on form_embed.js**
   **Impact:** If GHL CDN compromised, malicious JS executes on your domain
   **OWASP:** A08:2021 - Software and Data Integrity Failures
   **Fix Required:** Add integrity attribute or self-host script

2. **CSP frame-src allows all *.leadconnectorhq.com**
   **Impact:** Any GHL subdomain can be embedded
   **Recommendation:** Restrict to specific subdomain: `https://link.zeromotionmarketing.com`

### GHL API Key Management

✅ **Excellent:**
- No GHL API keys found in client-side code
- All external communication via iframe (no direct REST calls in code)

### Data Flow Validation

✅ **CAN-SPAM Compliant:**
- Email service (src/server/email.ts) has comprehensive compliance
- Physical address included
- Unsubscribe mechanism implemented
- List-Unsubscribe headers present

⚠️ **PII Handling:**
- **GOOD:** Sentry PII scrubbing configured
- **MISSING:** No explicit GDPR consent checkbox in forms (may be required for EU visitors)
- **GOOD:** Development lead storage in local files only

---

## STEP 5: FORMS, AUTH, AND SESSION SAFETY

### Form Security Analysis

#### Client-Side Validation (FormValidator.ts)

✅ **Excellent Implementation:**
- XSS protection via HTML entity encoding
- Regex-based validation for email, phone, name, URL
- Spam detection patterns (multiple URLs, repeated chars, spam keywords)
- Rate limiting (3 submissions/minute)
- Honeypot validation method present
- CSRF token generation/validation methods

⚠️ **Issues:**
1. **MEDIUM:** CSRF tokens generated but **not implemented** in API routes
2. **LOW:** FormValidator used client-side; server-side validation missing in /api/lead

### Cookie Security

✅ **Excellent:**
- HttpOnly, Secure, SameSite=lax
- Max-Age: 86400 (24h for general), 3600 (1h for API sessions)
- Session cookies generated for POST /api/* requests

⚠️ **Issues:**
- **LOW:** Session cookies generated but not validated/used for anything
- **MEDIUM:** No explicit CSRF mitigation despite session tokens

### Authentication & Sessions

✅ **N/A:** No authentication system present (public marketing site)

---

## STEP 6: HEADERS & APPSEC HARDENING

### Current Security Headers (vercel.json)

```
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: DENY
✅ X-XSS-Protection: 1; mode=block (deprecated but harmless)
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ HSTS: max-age=31536000; includeSubDomains; preload
✅ Permissions-Policy: (camera|microphone|geolocation)=()
✅ Cross-Origin-Resource-Policy: same-site
```

🔴 **CRITICAL: Content-Security-Policy Issues**

**Current CSP (Line 35-36):**
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dashboard.zeromotionmarketing.com https://link.zeromotionmarketing.com https://*.leadconnectorhq.com https://www.googletagmanager.com;
```

**Problems:**
1. `'unsafe-inline'` - Allows inline `<script>` tags (defeats XSS protection)
2. `'unsafe-eval'` - Allows `eval()`, `new Function()` (code injection vector)
3. Wildcard subdomain `https://*.leadconnectorhq.com` (overly permissive)

**Missing Directives:**
- `upgrade-insecure-requests` (force HTTPS for all resources)
- `base-uri 'self'` (already present, good)
- `frame-ancestors 'none'` (X-Frame-Options backup)
- `report-uri` or `report-to` (CSP violation reporting)

### Recommended CSP Fix (Nonce-Based)

**Implementation Required:**
1. Generate nonce per request in middleware
2. Pass nonce to Astro layouts
3. Add nonce to inline scripts
4. Update CSP header with `'nonce-{BASE64}'`

---

## STEP 7: PERFORMANCE & UX (CORE WEB VITALS)

### Build Analysis

✅ **Excellent:**
- Chunk splitting enabled (vendor-react, vendor-three, vendor-animation, vendor-ui)
- Asset versioning with content hashes
- Image optimization (webp, avif, quality: 85)
- CSS minification with cssnano
- Source maps disabled for production

### Image Optimization

✅ **Good:**
- Astro Image service configured
- Multiple format support (webp, avif, jpeg, png)
- Lazy loading on Contact iframe

⚠️ **Improvements Needed:**
- **MEDIUM:** Check if all images in /public use Astro <Image /> component
- **LOW:** Hero images should have priority/preload hints

### JavaScript Budget

✅ **Controlled:**
- Manual chunks prevent single large bundle
- React/Three.js isolated in separate chunks
- Astro islands for minimal hydration

⚠️ **Potential Issues:**
- Three.js bundle likely large (for 3D effects)
- **Recommendation:** Verify total JS < 300KB initial load

### Font Loading

⚠️ **MEDIUM ISSUE:**
- Fonts loaded from Google Fonts (external dependency)
- **Privacy:** GDPR concern (Google tracks users)
- **Performance:** External DNS lookup + SPOF
- **Recommendation:** Self-host fonts, add font-display: swap

### Cache Headers

✅ **Excellent Strategy:**
- Static assets: `max-age=31536000, immutable`
- Pages: `s-maxage=86400, stale-while-revalidate`
- API: `max-age=0, no-cache` (correct for dynamic)
- Service worker: `max-age=0, must-revalidate`

---

## STEP 8: SEO & CONTENT HYGIENE

### Meta Tags & OpenGraph

✅ **Excellent (index.astro):**
- Comprehensive title with location keywords
- Description under 160 chars
- Keywords defined
- Canonical URL set
- OpenGraph image specified

### Structured Data (JSON-LD)

✅ **Strong:**
- Organization schema with address, contact
- WebSite schema with SearchAction
- Proper @context and @type

⚠️ **Improvements:**
- Add LocalBusiness schema for better local SEO
- Verify social media URLs (currently placeholders)

### Sitemap & Robots.txt

✅ **robots.txt:**
- Allows all user-agents
- Sitemap declared
- API routes disallowed
- Crawl-delay: 1

⚠️ **Missing:**
- No automated sitemap validation
- **Recommendation:** Add `pnpm sitemap:validate` script

### Canonical URLs

✅ **Pattern Established:**
- Homepage sets canonical="/"
- Needs verification on other pages

---

## STEP 9: ACCESSIBILITY

### Automated Check Results (Inferred)

✅ **Good Practices Observed:**
- Semantic HTML (section, nav, main)
- ARIA labels (aria-labelledby="contact-title")
- Form inputs with proper labels (in GHL iframe)

⚠️ **Potential Issues:**
- **MEDIUM:** Skip links not verified
- **MEDIUM:** Focus management in modals not tested
- **LOW:** Color contrast not validated (dark theme with #6E00FF purple)

### Manual Test Checklist (3-5 Tasks)

1. **Keyboard Navigation:**
   - [ ] Tab through entire homepage
   - [ ] Verify focus visible on all interactive elements
   - [ ] Test ESC to close modals

2. **Screen Reader:**
   - [ ] Navigate with NVDA/JAWS
   - [ ] Verify heading hierarchy (h1 → h2 → h3, no skips)
   - [ ] Check ARIA labels announce correctly

3. **Reduced Motion:**
   - [ ] Enable prefers-reduced-motion
   - [ ] Verify animations disabled (per README note about logo video)

---

## STEP 10: ANALYTICS, MONITORING, AND LOGGING

### Sentry Configuration

✅ **Excellent (Both Client & Server):**
- DSN from environment variables
- Release tracking via Git SHA
- Sample rates appropriate (0.1 production, 1.0 dev)
- **PII Scrubbing:** request data, user email/IP redacted
- Browser tracing with target allowlist
- Session replay with text/media masking
- Error filtering (network errors, non-errors ignored)
- Custom helpers (reportError, trackApiError, trackEmailError)

✅ **beforeSend Hooks:**
- Sanitizes request.data to '[REDACTED]'
- Removes sensitive headers (authorization, cookie, x-api-key)
- Filters expected errors (ECONNRESET, EPIPE)

### Google Analytics / GTM

⚠️ **Not Verified:**
- Analytics.astro component exists but not reviewed in this audit
- **Recommendation:** Verify GA4 config and cookie consent integration

### Logging Strategy

✅ **Present:**
- Sentry for exceptions
- Console logging for unsubscribe actions (email.ts:234)

⚠️ **Missing:**
- No centralized logging for audit trail (e.g., form submissions)
- No documented alert thresholds

---

## STEP 11: TESTING STRATEGY & CI

### Current Playwright Tests

**Files:**
- `tests/dropdown.spec.ts`
- `tests/logo-size.spec.ts`

✅ **Configuration:**
- Desktop Chrome + Mobile Safari
- baseURL: localhost:4321
- Retries: 2 in CI

🟠 **HIGH RISK: Insufficient Coverage**

**Missing Critical Tests:**
1. **Smoke Tests:**
   - [ ] Homepage loads (/)
   - [ ] Contact form visible (/contact or /#contact)
   - [ ] Privacy/Terms pages load
   - [ ] 404 page renders

2. **API Tests:**
   - [ ] POST /api/lead with valid payload → 200
   - [ ] POST /api/lead with missing fields → 400
   - [ ] POST /api/lead rate limit → 429
   - [ ] GET /api/health → 200

3. **Security Tests:**
   - [ ] XSS payload in form → sanitized
   - [ ] SQL injection attempt → blocked
   - [ ] Large payload > 1MB → rejected

4. **Integration Tests:**
   - [ ] GHL iframe loads
   - [ ] Form submission workflow (if testable)

**Recommendation:** Add `tests/smoke.spec.ts` with above scenarios

### CI/CD Pipeline

⚠️ **Not Configured:**
- No GitHub Actions workflow visible
- No Vercel deployment checks defined

**Recommendation:** Create `.github/workflows/test.yml`:
```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm build
      - run: pnpm test:e2e
      - run: npx lighthouse-ci autorun
```

---

## STEP 12: SECRETS & ENVIRONMENTS

### Current Environment Variables (Inferred)

**Found in code:**
- `SENTRY_DSN` (server)
- `PUBLIC_SENTRY_DSN` (client)
- `RESEND_API_KEY`
- `LEADS_TO` (email recipient)
- `LEADS_FROM` (email sender)
- `MARKETING_FROM`
- `TRANSACTIONAL_FROM`
- `NODE_ENV`
- `VERCEL_GIT_COMMIT_SHA`
- `npm_package_version`

🔴 **CRITICAL: No .env.example File**

**Impact:**
- New developers don't know required variables
- Risk of committing real secrets to Git
- Deployment confusion

---

## STEP 13: DEPLOYMENT PLAN

### Vercel Project Settings Checklist

- [x] Framework: Astro
- [x] Build command: `pnpm build`
- [x] Output directory: `dist`
- [ ] Node version: **Verify 18.x or 20.x** (not explicit)
- [ ] Environment variables: **Set in Vercel dashboard**
- [ ] Preview password protection: **Recommended**
- [ ] Vercel Analytics: ✅ Enabled
- [ ] Speed Insights: ✅ Enabled

### Post-Deploy Smoke Checklist

```bash
# 1. Homepage loads
curl -I https://www.zeromotionmarketing.com/
# Expect: 200 OK

# 2. Security headers present
curl -I https://www.zeromotionmarketing.com/ | grep -E "(HSTS|X-Frame|CSP)"
# Expect: All headers present

# 3. API health check
curl https://www.zeromotionmarketing.com/api/health
# Expect: {"status":"healthy" or "degraded"}

# 4. Contact form visible (manual)
# Navigate to /#contact, verify iframe loads

# 5. Sentry receiving events
# Trigger test error, check Sentry dashboard

# 6. CSP violations (if implemented)
# Check browser console for CSP reports
```

---


