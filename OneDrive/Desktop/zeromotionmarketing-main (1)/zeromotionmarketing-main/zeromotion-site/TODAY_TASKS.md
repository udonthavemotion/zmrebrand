# ZeroMotion Site - Today's Critical Tasks
**Date:** November 15, 2025
**Status:** Phase 3 Service Clarity - Automation Platform Rebrand
**Repository:** https://github.com/udonthavemotion/zmrebrand.git

---

## Current Project State

### Recent Accomplishments (Last 5 Commits)
1. **Phase 3 Service Clarity** - Updated service pages and core components
2. **Automation Platform Rebrand** - Complete messaging shift from digital marketing to automation
3. **Pricing FAQ Update** - Clarified hosting charges
4. **CRM Page Hidden** - Temporarily removed from navigation menu
5. **Repository Cleanup** - Removed obsolete documentation and assets

### Build Status
- Build: PASSING
- Environment: Production (Vercel)
- Framework: Astro
- Current Branch: main
- Main Branch for PRs: master

### Repository Health
- All obsolete parent directory files cleaned up
- No uncommitted changes in project directory
- Remote synchronized with GitHub
- Build successful with minor warnings (expected)

---

## CRITICAL TASKS - Must Complete Today

### Priority 1: Brand Consistency Audit (30-45 minutes)

#### Task 1.1: Verify Mobile Menu Navigation
**File:** `src/components/Navbar.astro`
**Status:** NEEDS VERIFICATION
**Action Required:**
- Check mobile hamburger menu (lines ~350-380)
- Confirm service names match:
  - "Missed Call Text-Back" (not "Brand & Identity")
  - "ZeroMotion Automations" (not "Web Design")
  - "Custom AI Voice + Chat Agents" (not "AI Integration")
  - "ZeroMotion CRM"

**Why Critical:** Mobile menu confusion breaks brand messaging for majority of traffic

#### Task 1.2: Hero Section Messaging Verification
**File:** `src/components/Hero.astro`
**Status:** NEEDS VERIFICATION
**Expected:** "Zero Motion = zero manual effort, maximum conversion. AI-powered automation and CRM systems that transform Louisiana businesses from leads to loyal customers."
**Current (per docs):** May still reference "digital marketing"

**Why Critical:** First thing users see - must match automation platform positioning

#### Task 1.3: Footer Service Links Audit
**File:** `src/components/Footer.astro`
**Status:** NEEDS VERIFICATION
**Action Required:**
- Verify all service links use correct names
- Ensure routes match:
  - `/services/brand-identity` → Missed Call Text-Back
  - `/services/web-design` → ZeroMotion Automations
  - `/services/ai-integration` → AI Voice + Chat Agents
  - `/services/crm` → ZeroMotion CRM

**Why Critical:** Footer appears on every page - inconsistencies damage brand trust

#### Task 1.4: About Page Rebrand Completion
**File:** `src/pages/about.astro`
**Status:** NEEDS VERIFICATION
**Issues (per documentation):**
- Meta description may say "digital marketing agency"
- Keywords may include "digital marketing agency, web design"
- Content may have agency-focused positioning

**Required Changes:**
- Meta: "AI-powered automation and CRM systems for Louisiana businesses"
- Keywords: Replace "agency", "web design" with "automation", "CRM", "AI systems"
- Content: Shift from agency to automation platform positioning

**Why Critical:** About page influences conversion and brand perception

---

### Priority 2: Service Page Route Stability (15-20 minutes)

#### Task 2.1: Verify Service Routes Unchanged
**Critical Routes to Maintain:**
- `/services/brand-identity` → MUST remain (shows Missed Call Text-Back)
- `/services/web-design` → MUST remain (shows ZeroMotion Automations)
- `/services/ai-integration` → MUST remain (shows AI Voice + Chat Agents)
- `/services/crm` → MUST remain (shows ZeroMotion CRM)

**Action Required:**
- Verify each route loads correctly
- Confirm no 404s or redirects
- Check that page titles match service names (not route slugs)

**Why Critical:** Changing routes breaks SEO, backlinks, and existing traffic

#### Task 2.2: Internal Link Consistency Check
**Files to Audit:**
- All CTA buttons across homepage
- Service cards on pricing page
- Related services sections on each service page
- Navigation dropdowns (desktop + mobile)

**Action Required:**
- Ensure all internal links use correct service names in link text
- Verify hrefs point to correct routes
- Check for any remaining old service name references

**Why Critical:** Broken internal linking hurts SEO and user experience

---

### Priority 3: Content Consistency Sweep (20-30 minutes)

#### Task 3.1: Global Search for "Digital Marketing" References
**Action Required:**
- Search entire codebase for "digital marketing"
- Replace with:
  - "automation platform" (when describing ZeroMotion)
  - "automation and CRM systems" (when describing services)
  - "AI-powered automation" (when emphasizing technology)

**Files Likely to Contain:**
- All `.astro` page files
- Hero components
- Service pages
- About page
- Pricing page

**Why Critical:** Mixed messaging confuses prospects and weakens positioning

#### Task 3.2: Global Search for "Agency" References
**Action Required:**
- Search for "marketing agency" or "digital agency"
- Replace with:
  - "automation platform"
  - "automation provider"
  - "CRM and automation specialist"

**Exception:** Keep "agency" only in context of real estate agent clients or specific industry examples

**Why Critical:** Agency positioning attracts wrong type of prospects

#### Task 3.3: Service Name Consistency
**Action Required:**
- Search for old service names:
  - "Brand & Identity" or "Brand Identity" → "Missed Call Text-Back"
  - "Web Design" (when referring to service) → "ZeroMotion Automations"
  - "AI Integration" (when referring to service) → "AI Voice + Chat Agents"

**Files to Check:**
- All navigation components
- All CTA sections
- Related services sections
- Pricing page cards
- Homepage service cards

**Why Critical:** Inconsistent naming creates confusion and looks unprofessional

---

### Priority 4: CRM Page Status Resolution (10-15 minutes)

#### Task 4.1: Determine CRM Page Strategy
**Current Status:** Hidden from navigation per recent commit

**Decision Needed:**
- Option A: Keep hidden until content is ready
- Option B: Show with "Coming Soon" badge
- Option C: Redirect to contact page with CRM inquiry form

**Action Required:**
1. Review current CRM page content
2. Decide on strategy
3. Implement chosen option
4. Update navigation if showing page

**Why Critical:** CRM is a core service - hiding it indefinitely impacts sales

---

## MEDIUM PRIORITY TASKS - Complete If Time Allows

### Task 5: Mobile Responsiveness Spot Check (15 minutes)
**Action Required:**
- Test all service pages on mobile viewport (375px width)
- Verify hero sections don't clip
- Check that card grids stack properly
- Ensure CTAs are tappable (44px+ height)

**Files to Test:**
- Homepage
- All 4 service pages
- Pricing page
- About page

### Task 6: Performance Audit (10 minutes)
**Action Required:**
- Run Lighthouse audit on key pages
- Check Core Web Vitals
- Verify no console errors in production
- Test page load speed on 3G connection

**Target Metrics:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Task 7: Analytics Event Verification (10 minutes)
**Action Required:**
- Verify tracking events fire correctly for:
  - Service page views
  - CTA button clicks
  - Form submissions
  - Pricing page interactions

**Tools:** Browser DevTools Console or analytics dashboard

---

## NICE-TO-HAVE TASKS - Future Improvements

### Task 8: Create Service Showcase Images
**Status:** LOW PRIORITY
**Action Required:**
- Design visual examples of each service in action
- Create GIF/video demos of:
  - Missed call text-back flow
  - Automation workflow examples
  - AI voice agent conversation
  - CRM dashboard views

### Task 9: Add Client Testimonials Section
**Status:** LOW PRIORITY
**Action Required:**
- Collect real client testimonials (no fake ones)
- Add testimonials section to:
  - Homepage
  - Each service page
  - Pricing page

### Task 10: Expand FAQ Sections
**Status:** LOW PRIORITY
**Action Required:**
- Add automation-specific FAQs
- Address common objections
- Clarify GoHighLevel relationship

---

## KNOWN ISSUES & CONSTRAINTS

### Issue 1: Service Route Slug Mismatch
**Problem:** Route slugs (`/services/web-design`) don't match service names ("ZeroMotion Automations")
**Impact:** Can confuse users, but changing routes would break SEO
**Solution:** KEEP ROUTES AS-IS, ensure page titles/headings use correct names
**Status:** ACCEPTED - This is intentional to preserve SEO

### Issue 2: Missing Real Case Studies
**Problem:** No real client success stories or data yet
**Impact:** Limits social proof on service pages
**Solution:** Use clear, generic examples until real data available
**Status:** TEMPORARY - Collect real data over next 30 days

### Issue 3: CRM Page Content Gaps
**Problem:** CRM page may not be fully fleshed out
**Impact:** Can't show in navigation until content is complete
**Solution:** Complete CRM page content or add "Coming Soon" messaging
**Status:** PENDING DECISION (see Priority 4)

---

## QUALITY ASSURANCE CHECKLIST

Before marking any task as complete, verify:

- [ ] Change doesn't break mobile layout
- [ ] All links/CTAs work correctly
- [ ] No console errors in browser DevTools
- [ ] Build completes successfully (`npm run build`)
- [ ] No accessibility regressions (semantic HTML maintained)
- [ ] Brand voice remains "normal, human, chill" (no corporate jargon)
- [ ] Service names are used consistently
- [ ] No "marketing agency" or "digital marketing" language (unless specifically about clients)

---

## SUCCESS METRICS

Today's work is successful if:

1. All service names are consistent across desktop AND mobile navigation
2. Hero section clearly states "zero manual effort, maximum conversion"
3. No references to "digital marketing agency" remain on About page
4. All internal service links work correctly
5. Build passes without errors
6. Mobile experience is preserved

---

## DEPLOYMENT NOTES

### If Changes Are Made Today:

1. **Test Locally First:**
   ```bash
   npm run dev
   # Test on http://localhost:4321
   ```

2. **Build for Production:**
   ```bash
   npm run build
   # Verify no errors
   ```

3. **Commit Changes:**
   - Use descriptive commit messages
   - Reference specific fixes
   - Include Claude Code attribution

4. **Push to GitHub:**
   ```bash
   git push origin main
   ```

5. **Vercel Auto-Deploy:**
   - Push triggers automatic deployment
   - Monitor Vercel dashboard for deployment status
   - Test live site after deployment completes

---

## NEXT STEPS (Beyond Today)

1. **Week of Nov 18-22:**
   - Complete CRM page content
   - Add real client testimonials
   - Create service demo videos

2. **Week of Nov 25-29:**
   - Implement lead magnet strategy (per phase-2-lead-magnets.md)
   - Add downloadable resources
   - Create automation ROI calculator

3. **December 2025:**
   - Traffic amplification (per phase-4-traffic-amplification.md)
   - Ad campaigns deployment
   - Analytics deep dive

---

## RESOURCES & REFERENCES

- **Main Branch for PRs:** master
- **Current Branch:** main
- **Remote:** https://github.com/udonthavemotion/zmrebrand.git
- **Deployment:** Vercel (auto-deploy on push)
- **Framework Docs:** https://docs.astro.build/
- **Design System:** See `src/styles/global.css`

---

## NOTES & ASSUMPTIONS

1. All recent commits suggest rebrand work is nearly complete
2. Main missing pieces are consistency verification and cleanup
3. No major structural changes needed - only content/messaging tweaks
4. Build is stable and production-ready
5. Focus is on polish and consistency, not new features

---

**Last Updated:** November 15, 2025
**Next Review:** After completing Priority 1 tasks
