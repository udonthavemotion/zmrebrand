# ZeroMotion Site Optimization - Task Checklist

Use this checklist to track progress. Check off items as you complete them.

---

## 🎯 Phase 1: Quick Wins & Conversion (HIGH PRIORITY)

### Task 1: Enhance Hero Section
**File:** `src/components/Hero.astro`  
**Estimated Time:** 30-45 minutes

- [ ] Increase primary CTA button size and contrast
- [ ] Add urgency indicator ("Limited Spots" or "Free 30-min Consultation")
- [ ] Improve value proposition headline (make benefit-driven)
- [ ] Add sub-headline with specific outcomes
- [ ] Verify mobile button stacking
- [ ] Test button accessibility (WCAG AA contrast)
- [ ] Respect prefers-reduced-motion
- [ ] Test on mobile device

**Success Check:**
- [ ] CTA is visually dominant
- [ ] Value prop is clear within 3 seconds
- [ ] Mobile buttons are easily tappable (44x44px min)

---

### Task 2: Add Lead Magnet Section
**Create:** `src/components/LeadMagnetSection.astro`  
**Estimated Time:** 45-60 minutes

- [ ] Create new component file
- [ ] Add headline: "Get Your Free Digital Marketing Funnel Audit"
- [ ] Add sub-headline and benefit bullets
- [ ] Integrate GHL form (use existing formBase and formId)
- [ ] Style with dark background and purple gradient
- [ ] Make responsive (mobile-first)
- [ ] Add to `src/pages/index.astro` after Hero section
- [ ] Test form submission

**Success Check:**
- [ ] Section matches existing design style
- [ ] Form opens/submits correctly
- [ ] Responsive on mobile
- [ ] No layout shift

---

### Task 3: Mobile Sticky CTA Bar
**Create:** `src/components/MobileStickyCTA.astro`  
**Estimated Time:** 30-45 minutes

- [ ] Create component with fixed bottom positioning
- [ ] Add IntersectionObserver to show after hero scroll
- [ ] Style with gradient background matching brand
- [ ] Respect safe-area-inset-bottom (iOS notches)
- [ ] Only show on mobile (< 768px)
- [ ] Connect to StrategistModal or LeadModal
- [ ] Add to BaseLayout.astro after Footer
- [ ] Test slide-in animation

**Success Check:**
- [ ] Only shows on mobile
- [ ] Appears after scrolling past hero
- [ ] Respects iOS safe areas
- [ ] Opens modal correctly

---

### Task 4: Trust & Social Proof Section
**Create:** `src/components/TrustSection.astro`  
**Estimated Time:** 60-75 minutes

- [ ] Create new component file
- [ ] Add results/metrics section (3X leads, 90% retention, 30+ clients)
- [ ] Add client logo grid using images from `/public/assets/implementation/`:
  - [ ] brisclothing.png
  - [ ] godspeedbulldogs.png
  - [ ] southsidemobile.png
  - [ ] cursed ink.png
  - [ ] maxline.png
- [ ] Create testimonial card structure (use placeholders if needed)
- [ ] Add trust badges (Louisiana-based, No setup fees, etc.)
- [ ] Style with dark cards and purple accents
- [ ] Make responsive (horizontal scroll on mobile)
- [ ] Add to index.astro after Services section
- [ ] Apply grayscale filter to logos, color on hover

**Success Check:**
- [ ] Client logos visible and styled
- [ ] Responsive layout works
- [ ] Matches design aesthetic
- [ ] No broken images

---

## 🚀 Phase 2: Performance Optimization (CRITICAL)

### Task 5: Image Optimization
**Estimated Time:** 60-90 minutes

#### Part A: Generate Optimized Images
- [ ] Install Sharp (if not available): `npm install sharp --save-dev`
- [ ] Create or use script: `/scripts/optimize-images.js`
- [ ] Convert priority images to WebP (90% quality):
  - [ ] `/brand/ZeroMotion-Outline.png`
  - [ ] `/brand/ZeroMotion-Layerstyle.png`
  - [ ] `/favico/android-chrome-512x512.png`
  - [ ] Client logos in `/assets/implementation/`
  - [ ] Service section images
- [ ] Convert critical images to AVIF (85% quality):
  - [ ] Hero logo
  - [ ] Footer logo
  - [ ] OG image
- [ ] Verify file size reduction (should be 50-80% smaller)

#### Part B: Update Image Tags
- [ ] Update Hero.astro (logo)
- [ ] Update Navbar.astro (logo)
- [ ] Update Footer.astro (logo)
- [ ] Update Services.astro (service images)
- [ ] Update TrustSection.astro (client logos)
- [ ] Add `<picture>` tags with WebP/AVIF/fallback
- [ ] Add proper width/height to prevent layout shift
- [ ] Verify lazy loading on below-fold images

**Picture Tag Pattern:**
```html
<picture>
  <source srcset="/image.avif" type="image/avif" />
  <source srcset="/image.webp" type="image/webp" />
  <img src="/image.png" alt="..." loading="lazy" width="800" height="600" />
</picture>
```

**Success Check:**
- [ ] Page size reduced by 50%+
- [ ] Images load in modern format (check DevTools Network tab)
- [ ] No layout shift (CLS = 0)
- [ ] All images have alt text

---

### Task 6: JavaScript Bundle Optimization
**Estimated Time:** 30-45 minutes

#### Part A: Lazy Load Sentry
- [ ] Open `src/layouts/BaseLayout.astro` (line 333)
- [ ] Change Sentry to lazy load:
```javascript
setTimeout(() => import('/sentry.client.config.js'), 5000);
```
- [ ] Test error tracking still works

#### Part B: Audit Dependencies
- [ ] Check if Three.js is used (search for `@react-three`)
- [ ] If unused, remove from `package.json`
- [ ] Check if Framer Motion is heavily used
- [ ] Verify code splitting config in `astro.config.mjs`

#### Part C: Defer Non-Critical Scripts
- [ ] Add `defer` to non-critical scripts
- [ ] Verify analytics loads async
- [ ] Check EventTracker loads after page interactive

**Success Check:**
- [ ] Client bundle < 300KB (down from 440KB)
- [ ] Sentry loads after 5 seconds
- [ ] No errors in console
- [ ] Page interactive time improved

---

## 🎨 Phase 3: Polish & SEO (MEDIUM PRIORITY)

### Task 7: SEO Enhancements
**Estimated Time:** 45-60 minutes

#### Part A: Homepage Meta Tags
- [ ] Update title in `src/pages/index.astro`:
```
"Digital Marketing Agency Houma LA | AI-Powered Web Design | ZeroMotion"
```
- [ ] Update description (155 chars):
```
"ZeroMotion Marketing: Louisiana's premier AI-powered digital marketing agency. Get 3X more leads with professional web design, automation, and local SEO."
```
- [ ] Verify keywords include: Houma, Thibodaux, Louisiana, digital marketing, web design

#### Part B: Heading Structure
- [ ] Verify single H1 per page
- [ ] Check H2-H6 hierarchy (no skipping)
- [ ] Audit new sections (LeadMagnet, Trust) for proper headings

#### Part C: Alt Text Audit
- [ ] Hero video aria-label
- [ ] All component images have descriptive alt
- [ ] Decorative images use alt="" or aria-hidden
- [ ] Logo alts include brand name

#### Part D: Internal Linking
- [ ] Add contextual links from homepage to service pages
- [ ] Link trust section to case studies (if they exist)
- [ ] Ensure all pages accessible within 3 clicks

**Success Check:**
- [ ] Meta tags optimized for search
- [ ] Heading hierarchy correct
- [ ] All images have alt text
- [ ] No accessibility errors

---

## ✅ Phase 4: Testing & Validation (MUST DO)

### Task 8: Build & Functionality Testing
**Estimated Time:** 30-45 minutes

- [ ] Run build: `npm run build`
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No console warnings

#### Functionality Checklist
- [ ] Homepage loads correctly
- [ ] Hero video plays
- [ ] All CTAs work:
  - [ ] Hero "View Pricing" button
  - [ ] Hero "Take Our Quiz" button
  - [ ] Lead Magnet form/CTA
  - [ ] Mobile Sticky CTA
- [ ] GHL Forms open:
  - [ ] StrategistModal (calendar)
  - [ ] LeadModal (form)
  - [ ] Contact page form
- [ ] Navigation works:
  - [ ] All nav links
  - [ ] Services dropdown
  - [ ] Footer links
- [ ] No broken images
- [ ] No 404 errors

#### Mobile Testing
- [ ] Test on real mobile device (or Chrome DevTools mobile emulator)
- [ ] Buttons are tappable (44x44px min)
- [ ] Text is readable (16px min)
- [ ] No horizontal scroll
- [ ] Sticky CTA appears correctly
- [ ] Safe areas respected (iOS notches)

---

### Task 9: Performance Audit
**Estimated Time:** 30 minutes

#### Lighthouse Audit
- [ ] Run Lighthouse (Mobile):
  - [ ] Performance: ___/100 (target: 90+)
  - [ ] Accessibility: ___/100 (target: 90+)
  - [ ] Best Practices: ___/100 (target: 90+)
  - [ ] SEO: ___/100 (target: 90+)
- [ ] Run Lighthouse (Desktop):
  - [ ] Performance: ___/100 (target: 90+)
  - [ ] Accessibility: ___/100 (target: 90+)
  - [ ] Best Practices: ___/100 (target: 90+)
  - [ ] SEO: ___/100 (target: 90+)

#### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1 (target: 0)

#### Network Analysis (Chrome DevTools)
- [ ] Total requests: ___/30 (target: < 30)
- [ ] Total page size: ___MB (target: < 1MB excluding videos)
- [ ] Images in WebP/AVIF: ___% (target: 100%)
- [ ] JavaScript bundle size: ___KB (target: < 300KB)

**Before/After Comparison:**
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Mobile Lighthouse | ? | ___ | ___ |
| Desktop Lighthouse | ? | ___ | ___ |
| Page Size | ? | ___ | ___ |
| JS Bundle | 440KB | ___ | ___ |
| Total Requests | ? | ___ | ___ |
| LCP | ? | ___ | ___ |
| CLS | ? | ___ | ___ |

---

## 🎯 Final Acceptance Checklist

### Performance ✅
- [ ] Lighthouse Mobile Score ≥ 90
- [ ] Lighthouse Desktop Score ≥ 90
- [ ] Total requests < 30
- [ ] Page weight < 1MB (excluding videos)
- [ ] CLS score ≤ 0.1
- [ ] LCP < 2.5s

### Conversion ✅
- [ ] Hero CTA is prominent and high-contrast
- [ ] Lead magnet section added with GHL form
- [ ] Trust section with client logos and results
- [ ] Mobile sticky CTA bar implemented
- [ ] All GHL forms/calendars functional

### Code Quality ✅
- [ ] Build passes without errors
- [ ] All links work
- [ ] Console is clean (no errors)
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Respects prefers-reduced-motion
- [ ] WCAG AA compliant

### Preservation ✅
- [ ] All custom backgrounds/media intact
- [ ] Design aesthetic unchanged
- [ ] GHL integration working
- [ ] Existing site structure maintained
- [ ] No broken functionality

---

## 📝 Notes & Issues

### Issues Encountered:
```
(Document any problems or blockers here)
```

### Decisions Made:
```
(Document any design/technical decisions here)
```

### Follow-up Items:
```
(Items that need client input or future work)
```

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] All tests passed
- [ ] Lighthouse scores meet targets
- [ ] No console errors
- [ ] GHL forms tested
- [ ] Mobile tested on real device
- [ ] Desktop tested in multiple browsers
- [ ] Images optimized and loading correctly
- [ ] No broken links
- [ ] Analytics working (GTM, Vercel)
- [ ] Git commit with descriptive message
- [ ] Push to main branch
- [ ] Verify Vercel deployment successful
- [ ] Test production URL
- [ ] Monitor for errors in Sentry

---

**Status:** ⏸️ Not Started | 🚧 In Progress | ✅ Complete

**Last Updated:** [Date]  
**Completed By:** [Your Name]  
**Lighthouse Scores:** Mobile: ___/100 | Desktop: ___/100

