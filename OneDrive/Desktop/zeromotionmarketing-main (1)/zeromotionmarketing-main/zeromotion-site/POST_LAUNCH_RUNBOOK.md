# Post-Launch Operations Runbook
## ZeroMotion Marketing - Production Monitoring & Incident Response

**Last Updated:** October 21, 2025  
**On-Call:** zeromotionmarketing@gmail.com  
**Status Page:** https://stats.uptimerobot.com/[YOUR-ID] (if configured)

---

## 📊 KEY METRICS TO MONITOR

### 1. Uptime & Availability
- **Target:** 99.9% uptime (≤ 43 minutes downtime/month)
- **Monitor:** `/api/health` endpoint every 5 minutes
- **Tool:** UptimeRobot, Pingdom, or Vercel's built-in monitoring

**Dashboard:**
```
Health Endpoint: https://www.zeromotionmarketing.com/api/health
Expected Response: {"status":"healthy","timestamp":"..."}
Alert Threshold: 2 consecutive failures (10 minutes down)
```

### 2. Error Rates (Sentry)
- **Target:** < 10 errors/hour in production
- **Alert:** Email when error rate > 20/hour

**Key Error Types to Watch:**
- `RESEND_ERROR`: Email service failures
- `VALIDATION_ERROR`: Malformed form submissions
- `PAYLOAD_TOO_LARGE`: DoS attempt indicators
- `Unhandled Promise Rejection`: Critical bugs

**Sentry Dashboard:**
- URL: https://sentry.io/organizations/[org]/issues/
- Filters: `is:unresolved environment:production`
- Review: Daily at 9 AM

### 3. Performance Metrics
- **Target:** P95 response time < 1.5 seconds
- **Tool:** Vercel Speed Insights

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Alert if:**
- P95 > 3 seconds for 15 minutes
- LCP > 4 seconds (5+ consecutive visitors)

### 4. Lead Conversion Metrics
- **Track:** Form submissions via /api/lead
- **Expected:** 5-20 leads/day (adjust based on traffic)
- **Alert:** Zero leads for 24 hours (possible form breakage)

**Manual Check:**
- Email inbox: `LEADS_TO` (zeromotionmarketing@gmail.com)
- Verify test leads arriving correctly

### 5. Traffic Patterns (Vercel Analytics)
- **Expected:** 100-500 page views/day (adjust per your baseline)
- **Alert:** 80% drop in traffic (possible DNS/CDN issue)
- **Spike Detection:** 500% increase (possible bot attack or viral traffic)

---

## 🚨 ALERT CONFIGURATION

### Sentry Alerts
**Navigate:** Sentry Dashboard → Alerts → Create Alert

#### Alert Rule 1: High Error Rate
```
Condition: Error count ≥ 20 in 1 hour
Environment: production
Action: Email to on-call + Slack #incidents
```

#### Alert Rule 2: Critical Errors
```
Condition: Any error with tag error_type=critical
Environment: production
Action: Immediate email + SMS
```

#### Alert Rule 3: Performance Degradation
```
Condition: P95 transaction duration > 3000ms for 10 minutes
Environment: production
Action: Email to engineering
```

### Vercel Alerts (Configure in Dashboard)
- **Deployment Failed:** Email immediately
- **Build Warnings:** Email daily digest
- **Domain SSL Expiry:** Email 30 days before (auto-renews, but monitor)

### UptimeRobot Alerts
```
Monitor Name: ZeroMotion Health Check
URL: https://www.zeromotionmarketing.com/api/health
Interval: 5 minutes
Alert Contacts: Email + SMS (optional)
```

---

## 🔥 INCIDENT RESPONSE PROCEDURES

### Severity Levels

| Level | Definition | Response Time | Examples |
|-------|------------|---------------|----------|
| **P0 - Critical** | Site completely down | 15 minutes | DNS failure, server crash, data breach |
| **P1 - High** | Major feature broken | 1 hour | Contact form not working, API errors |
| **P2 - Medium** | Minor feature degraded | 4 hours | Slow page load, styling issues |
| **P3 - Low** | Cosmetic issue | Next business day | Typo, minor UI glitch |

### P0: Site Down Response

**Symptoms:**
- Homepage returns 5xx errors
- `/api/health` returns 503
- UptimeRobot sends alert

**Immediate Actions (15 min):**
1. **Verify Issue:**
   ```bash
   curl -I https://www.zeromotionmarketing.com/
   # If 5xx or timeout, proceed
   ```

2. **Check Vercel Status:**
   - Visit: https://www.vercel-status.com/
   - If Vercel is down, wait for recovery (ETA usually < 30 min)

3. **Check Recent Deployments:**
   - Vercel Dashboard → Deployments
   - If latest deploy failed, rollback:
     ```bash
     vercel rollback [previous-deployment-url]
     ```

4. **DNS Check:**
   ```bash
   nslookup www.zeromotionmarketing.com
   # Should return Vercel CNAME
   ```

5. **Notify Stakeholders:**
   - Email: "Site down, investigating. ETA: [time]"
   - Update status page (if configured)

**Root Cause Analysis (within 24h):**
- Review Sentry errors around incident time
- Check Vercel deployment logs
- Document findings in incident postmortem

---

### P1: Contact Form Broken

**Symptoms:**
- Zero leads received for > 4 hours during business hours
- `/api/lead` returns errors
- GHL iframe not loading

**Actions:**
1. **Test Form Manually:**
   - Visit: https://www.zeromotionmarketing.com/#contact
   - Submit test lead
   - Check email inbox

2. **Check API Endpoint:**
   ```bash
   curl -X POST https://www.zeromotionmarketing.com/api/lead \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","phone":"555-0000","businessType":"General","niche":"General"}'
   ```

3. **Common Fixes:**
   - **Resend API Key Invalid:** Verify `RESEND_API_KEY` in Vercel env vars
   - **GHL Iframe Blocked:** Check CSP header, whitelist GHL domain
   - **Rate Limit Hit:** Check logs, increase limit if legitimate traffic

4. **Temporary Workaround:**
   - Add email address to footer: "Contact us directly at zeromotionmarketing@gmail.com"
   - Post on social: "Experiencing form issues, email us directly"

---

### P1: CSP Violations Breaking Functionality

**Symptoms:**
- Browser console errors: "Refused to execute inline script..."
- Analytics not tracking
- Third-party scripts blocked

**Actions:**
1. **Identify Blocked Resource:**
   - Open DevTools → Console
   - Note blocked domain/script

2. **Update CSP in vercel.json:**
   ```json
   "value": "... script-src 'self' https://trusted-domain.com; ..."
   ```

3. **Deploy Fix:**
   ```bash
   git commit -am "fix: Add [domain] to CSP whitelist"
   git push origin main
   # Wait for Vercel auto-deploy (~2 min)
   ```

4. **Verify:**
   ```bash
   curl -I https://www.zeromotionmarketing.com/ | grep "content-security-policy"
   ```

---

### P2: Performance Degradation

**Symptoms:**
- Lighthouse score drops from 90+ to < 70
- Vercel Speed Insights shows P95 > 3s
- User complaints about slow site

**Actions:**
1. **Check Vercel Analytics:**
   - Dashboard → Speed Insights
   - Identify slow pages/regions

2. **Common Culprits:**
   - **Large Images:** Optimize with Astro Image service
   - **Unoptimized Videos:** Convert to WebP/AVIF, add lazy loading
   - **Third-Party Scripts:** Defer non-critical scripts
   - **Database Queries:** Not applicable (static site)

3. **Quick Wins:**
   ```bash
   # Optimize images
   pnpm run optimize:images

   # Check bundle size
   pnpm run build:analyze
   ```

4. **Long-Term Fix:**
   - Add image optimization to CI/CD
   - Implement service worker for caching
   - Consider CDN for video assets

---

## 📋 DAILY OPERATIONS CHECKLIST

### Morning Routine (9:00 AM, 10 minutes)
- [ ] Check Sentry dashboard: Any new unresolved errors?
- [ ] Review Vercel deployments: Any failed builds overnight?
- [ ] Check email inbox: Any leads submitted?
- [ ] Verify `/api/health`: Status "healthy"?
- [ ] Quick Lighthouse audit (once/week): Score still 90+?

### Weekly Review (Monday, 30 minutes)
- [ ] Review Vercel Analytics: Traffic trends normal?
- [ ] Check Google Search Console: Any new indexing errors?
- [ ] Review Sentry error trends: Any recurring issues?
- [ ] Test contact form: Submit test lead, verify email received
- [ ] Update dependencies (security patches): `pnpm update`

### Monthly Audit (First Monday, 2 hours)
- [ ] Full security header check: `npm run security:scan`
- [ ] SSL certificate check: Expiry > 30 days?
- [ ] Backup environment variables: Export from Vercel to secure vault
- [ ] Review and rotate API keys (quarterly)
- [ ] Run full Playwright test suite: `pnpm test:e2e`
- [ ] Performance benchmark: Compare Lighthouse scores vs last month
- [ ] Update documentation: Any new procedures to document?

---

## 🔧 COMMON MAINTENANCE TASKS

### Update Dependencies
```bash
# Check for updates
pnpm outdated

# Update non-breaking changes
pnpm update

# Update major versions (caution!)
pnpm upgrade-interactive

# Run tests after update
pnpm typecheck && pnpm build && pnpm test:e2e
```

### Rotate API Keys
**Frequency:** Every 90 days or immediately after suspected compromise

**Process:**
1. Generate new key in service dashboard (Resend, Sentry, etc.)
2. Update in Vercel: Settings → Environment Variables
3. Redeploy: `vercel --prod` or trigger via commit
4. Test in production: Submit test lead
5. Revoke old key after 24h grace period

### Update CSP Whitelist
**When:** Adding new third-party service (e.g., Google Tag Manager)

1. Test locally with CSP violation reporting
2. Update `vercel.json` line 36
3. Commit: `git commit -am "feat: Add [service] to CSP"`
4. Deploy and verify no console errors

### Add New Environment Variable
1. Add to `.env.example` with documentation
2. Set in Vercel: Dashboard → Settings → Environment Variables
3. Update README.md if user-facing
4. Redeploy to apply

---

## 📞 ESCALATION CONTACTS

| Role | Contact | Availability | Escalation Path |
|------|---------|--------------|-----------------|
| **Primary On-Call** | zeromotionmarketing@gmail.com | 9 AM - 6 PM CST | → Technical Lead |
| **Technical Lead** | [Name/Email] | 24/7 (emergencies) | → CTO/Senior Eng |
| **Vercel Support** | https://vercel.com/support | 24/7 | Submit ticket + Tweet @vercel |
| **Resend Support** | https://resend.com/support | Business hours | Email support@ |
| **Sentry Support** | https://sentry.io/support/ | Business hours | Dashboard chat |

---

## 🔄 ROLLBACK PROCEDURES

### Via Vercel Dashboard (Fastest)
1. Go to: https://vercel.com/[team]/[project]/deployments
2. Find last stable deployment (marked "Production")
3. Click "•••" menu → "Promote to Production"
4. Confirm rollback
5. Verify in browser (hard refresh: Ctrl+Shift+R)

### Via Vercel CLI
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Example:
# vercel rollback https://zeromotion-abc123.vercel.app
```

### Via Git Revert (If needed)
```bash
# Revert last commit
git revert HEAD

# Push to trigger new deployment
git push origin main

# Or revert to specific commit
git reset --hard [commit-sha]
git push --force origin main  # CAUTION: Only in emergencies
```

---

## 📈 SUCCESS METRICS (Monthly Report)

### Availability
- Uptime %: _______ (target: 99.9%)
- Downtime incidents: _______ (target: 0)
- Mean time to recovery (MTTR): _______ (target: < 15 min)

### Performance
- Average Lighthouse score: _______ (target: > 90)
- P95 page load time: _______ (target: < 1.5s)
- Core Web Vitals pass rate: _______ (target: > 95%)

### Business Metrics
- Total leads submitted: _______
- Form conversion rate: _______
- Unique visitors: _______
- Bounce rate: _______ (target: < 50%)

### Errors & Issues
- Total Sentry errors: _______ (target: < 50/month)
- P0/P1 incidents: _______ (target: 0)
- Security vulnerabilities: _______ (target: 0)

---

## 🎯 CONTINUOUS IMPROVEMENT

### Quarterly Goals
- [ ] Achieve Lighthouse 100 across all metrics
- [ ] Reduce error rate by 50%
- [ ] Implement automated alerting for all critical paths
- [ ] Self-host all third-party resources (Google Fonts, etc.)
- [ ] Add E2E smoke tests to CI/CD

### Feature Requests Tracking
- [ ] Add live chat widget (after CSP review)
- [ ] Implement A/B testing for hero CTA
- [ ] Add blog/resources section
- [ ] Create client portal integration

**Backlog:** Use GitHub Issues or Notion for tracking

---

**End of Runbook. Review and update quarterly.**

**Last Review:** _______________________  
**Next Review Due:** _______________________

