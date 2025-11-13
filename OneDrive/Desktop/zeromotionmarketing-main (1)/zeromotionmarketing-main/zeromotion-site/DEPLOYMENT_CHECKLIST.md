# Pre-Deployment Checklist for ZeroMotion Marketing

**Last Updated:** October 21, 2025  
**Target:** Vercel Production Deployment

---

## 1. PRE-DEPLOY VALIDATION (Local)

### Environment Setup
- [ ] All environment variables documented in `.env.example`
- [ ] Local `.env` file configured with development keys
- [ ] No secrets committed to Git (run `git log -p | grep -E "(API_KEY|SECRET|PASSWORD)"`)

### Code Quality
```bash
# Run all checks locally before deploying
pnpm install              # Install dependencies
pnpm typecheck           # TypeScript validation
pnpm lint                # ESLint + Astro check
pnpm build               # Production build test
```

- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm build` completes successfully
- [ ] Build size < 500KB for critical JS bundles
- [ ] No console errors during build

### Testing
```bash
pnpm test:e2e            # Run Playwright tests
pnpm test:e2e -- tests/smoke.spec.ts  # Smoke tests
pnpm test:e2e -- tests/api-lead.spec.ts  # API tests
```

- [ ] All smoke tests pass
- [ ] All API tests pass
- [ ] Manual test: Contact form submission works locally
- [ ] Manual test: All pages load without errors

---

## 2. VERCEL PROJECT CONFIGURATION

### Framework Settings
- [ ] Framework Preset: **Astro**
- [ ] Build Command: `pnpm build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `pnpm install`
- [ ] Node.js Version: **20.x** (or 18.x minimum)

### Environment Variables (Production)
Navigate to: **Vercel Dashboard → [Project] → Settings → Environment Variables**

**Required for Production:**
- [ ] `RESEND_API_KEY` = `re_xxx...` (from Resend dashboard)
- [ ] `SENTRY_DSN` = `https://xxx@oxxxx.ingest.us.sentry.io/xxx`
- [ ] `PUBLIC_SENTRY_DSN` = `https://xxx@oxxxx.ingest.us.sentry.io/xxx`
- [ ] `LEADS_TO` = `zeromotionmarketing@gmail.com`
- [ ] `LEADS_FROM` = `leads@zeromotion.ai`

**Verify Scoping:**
- [ ] All variables set for: **Production** environment
- [ ] Sensitive variables (API keys) NOT set for Preview (use separate dev keys)

### Domain Configuration
- [ ] Primary domain: `www.zeromotionmarketing.com` (configured)
- [ ] Redirect: `zeromotionmarketing.com` → `www.zeromotionmarketing.com`
- [ ] SSL certificate: Auto-provisioned by Vercel ✅
- [ ] Custom domain DNS: CNAME pointing to `cname.vercel-dns.com`

### Analytics & Monitoring
- [ ] Vercel Analytics: **Enabled** ✅
- [ ] Vercel Speed Insights: **Enabled** ✅
- [ ] Sentry project created and DSN configured

---

## 3. SECURITY VERIFICATION

### Headers Check (After Deploy)
```bash
# Test security headers on production
curl -I https://www.zeromotionmarketing.com/ | grep -E "(CSP|HSTS|X-Frame)"

# Expected output:
# content-security-policy: default-src 'self'; ...
# strict-transport-security: max-age=31536000; includeSubDomains; preload
# x-frame-options: DENY
```

- [ ] CSP header present and does NOT contain `unsafe-inline` or `unsafe-eval`
- [ ] HSTS header includes `preload` flag
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy: strict-origin-when-cross-origin

### CSP Validation
- [ ] Open browser DevTools → Console
- [ ] Navigate to https://www.zeromotionmarketing.com/
- [ ] No CSP violation errors
- [ ] If violations exist, whitelist necessary domains

### SSL/TLS Check
```bash
# Test SSL configuration
curl -I https://www.zeromotionmarketing.com/ | head -1
# Expected: HTTP/2 200
```

- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL Labs grade: **A or A+** (test at https://www.ssllabs.com/ssltest/)

---

## 4. FUNCTIONALITY TESTING (Production)

### Critical User Journeys
- [ ] **Homepage:** https://www.zeromotionmarketing.com/ loads in < 3s
- [ ] **Contact Form:** Scroll to #contact, verify GHL iframe loads
- [ ] **Submit Test Lead:** Fill form, submit, verify email received at `LEADS_TO`
- [ ] **Privacy Policy:** https://www.zeromotionmarketing.com/privacy loads
- [ ] **Terms:** https://www.zeromotionmarketing.com/terms loads
- [ ] **404 Page:** Visit non-existent URL, verify custom 404 page (no stack traces)

### API Endpoints
```bash
# Test health check
curl https://www.zeromotionmarketing.com/api/health
# Expected: {"status":"healthy" or "degraded", ...}

# Test lead submission (use test data)
curl -X POST https://www.zeromotionmarketing.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Deploy","phone":"555-0000","businessType":"General","niche":"General"}'
# Expected: {"ok":true,"message":"Lead submitted successfully"}
```

- [ ] `/api/health` returns 200 with status
- [ ] `/api/lead` accepts valid submissions
- [ ] `/api/lead` rejects invalid submissions (400 error)

### Mobile Testing
- [ ] Test on iPhone (Safari): No horizontal scroll, tap targets ≥ 44px
- [ ] Test on Android (Chrome): Navigation works, form submits
- [ ] Responsive breakpoints: 375px, 768px, 1024px, 1440px

---

## 5. PERFORMANCE VALIDATION

### Lighthouse Audit
```bash
# Run Lighthouse CI (or use web.dev/measure)
npx lighthouse https://www.zeromotionmarketing.com/ \
  --output=json --output-path=./lighthouse-production.json \
  --chrome-flags="--headless"
```

**Target Scores:**
- [ ] Performance: **≥ 90**
- [ ] Accessibility: **≥ 95**
- [ ] Best Practices: **≥ 95**
- [ ] SEO: **100**

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): **< 2.5s**
- [ ] FID (First Input Delay): **< 100ms**
- [ ] CLS (Cumulative Layout Shift): **< 0.1**

### Asset Optimization
- [ ] Images served in WebP/AVIF formats
- [ ] Critical CSS inlined
- [ ] JavaScript chunks < 200KB each
- [ ] Fonts self-hosted or have `font-display: swap`

---

## 6. SEO & ANALYTICS

### Search Console
- [ ] Google Search Console: Domain verified
- [ ] Sitemap submitted: `https://www.zeromotionmarketing.com/sitemap.xml`
- [ ] robots.txt accessible: `https://www.zeromotionmarketing.com/robots.txt`

### Analytics Setup
- [ ] Google Analytics 4 (GA4) tracking code installed (if applicable)
- [ ] Sentry receiving events (trigger test error)
- [ ] Vercel Analytics dashboard showing data

### Meta Tags Validation
- [ ] Open Graph image displays correctly (share on Facebook/LinkedIn)
- [ ] Twitter Card preview looks good (use https://cards-dev.twitter.com/validator)
- [ ] Structured data valid (test on https://search.google.com/test/rich-results)

---

## 7. MONITORING & ALERTS

### Sentry Configuration
- [ ] Sentry project: "zeromotion-marketing" created
- [ ] Alert rules configured:
  - Error rate > 10 errors/hour → Email alert
  - Performance degradation (P95 > 3s) → Slack notification
- [ ] Source maps uploaded (verify stack traces are readable)

### Uptime Monitoring (Recommended)
- [ ] Configure UptimeRobot or similar:
  - Monitor: `https://www.zeromotionmarketing.com/api/health`
  - Interval: 5 minutes
  - Alert: Email + SMS if down

---

## 8. POST-DEPLOY SMOKE TEST (5 Minutes)

**Immediate Actions After Deploy:**

```bash
# 1. Verify deployment succeeded
curl -I https://www.zeromotionmarketing.com/
# Expected: HTTP/2 200

# 2. Check security headers
curl -I https://www.zeromotionmarketing.com/ | grep -i "content-security-policy"
# Expected: CSP header present without unsafe-inline

# 3. Test API health
curl https://www.zeromotionmarketing.com/api/health
# Expected: {"status":"healthy",...}

# 4. Submit test lead
curl -X POST https://www.zeromotionmarketing.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Deploy Test","phone":"555-TEST","businessType":"General","niche":"General"}'
# Expected: {"ok":true,...}

# 5. Verify Sentry connection (manually trigger error)
# Open browser console: throw new Error("Test error")
# Check Sentry dashboard for event
```

- [ ] All 5 smoke tests passed
- [ ] No console errors in browser DevTools
- [ ] Test email received at `LEADS_TO` inbox

---

## 9. ROLLBACK PLAN (If Issues Detected)

### Immediate Rollback
If critical issues found (e.g., site down, data loss):

1. **Revert Deployment:**
   ```bash
   # Via Vercel CLI
   vercel rollback [previous-deployment-url]
   
   # Or via Vercel Dashboard:
   # Deployments → Previous Deployment → Promote to Production
   ```

2. **Notify Team:**
   - Post in Slack/Discord: "Production rollback initiated due to [issue]"
   - Update status page if applicable

3. **Investigate Locally:**
   - Pull deployed commit: `git checkout [SHA]`
   - Reproduce issue: `pnpm build && pnpm preview`
   - Fix and re-deploy

### Common Issues & Fixes

| Issue | Symptoms | Fix |
|-------|----------|-----|
| CSP blocking scripts | Console errors: "Refused to execute inline script" | Update `vercel.json` CSP, add nonce or hash |
| API 500 errors | `/api/lead` fails | Check Vercel logs, verify `RESEND_API_KEY` set |
| Fonts not loading | FOUT (flash of unstyled text) | Self-host fonts, add `font-display: swap` |
| Sentry not reporting | No errors in dashboard | Verify `SENTRY_DSN` in Vercel env vars |

---

## 10. FINAL SIGN-OFF

**Deployment Lead:** _______________________  
**QA Approved:** _______________________  
**Date/Time:** _______________________  

**Post-Deploy Actions:**
- [ ] Tag release in Git: `git tag -a v1.0.0 -m "Production launch"`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Update CHANGELOG.md
- [ ] Announce launch to team/stakeholders

---

**🚀 DEPLOYMENT COMPLETE! Monitor for 24 hours post-launch.**

Next: See `POST_LAUNCH_RUNBOOK.md` for ongoing operations guide.

