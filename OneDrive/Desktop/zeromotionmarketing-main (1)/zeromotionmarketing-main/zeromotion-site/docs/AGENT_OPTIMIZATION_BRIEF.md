# ZeroMotion Marketing Site Optimization - Agent Brief

## 🎯 Mission
Optimize the ZeroMotion marketing website for **conversion, performance, and mobile UX** while preserving all existing design assets, GHL integration, and site personality.

---

## 📋 Project Context

### Site Details
- **Framework:** Astro 5.12.9 (SSR mode)
- **Hosting:** Vercel
- **Current Domain:** zeromotionmarketing.com
- **Tech Stack:** Astro, React, Tailwind CSS v4, TypeScript
- **CRM:** GoHighLevel (GHL) - all forms, calendars, and popups
- **Analytics:** Google Tag Manager, Vercel Analytics, Sentry

### Current Build Performance
- **Server Bundle:** ~3s build time
- **Client Bundles:** 
  - Sentry: 249KB (optimization opportunity)
  - Client: 188KB (optimization opportunity)
  - Total modules: 268
- **Images:** 51 PNGs + 24 JPGs (NO WebP/AVIF currently)

---

## 🚫 CRITICAL: DO NOT CHANGE

### 1. Design & Brand Identity
- ✋ **Keep all custom backgrounds, textures, and media** in `/public/assets/`, `/public/photos/`, `/public/pictures/`
- ✋ **Preserve the existing visual style, colors, and personality**
- ✋ **Do not replace with generic stock imagery or templates**
- ✋ **Maintain the dark purple theme** (`--zm-bg: #0d0d1a`, `--zm-primary: #8b5cf6`)

### 2. GoHighLevel (GHL) Integration
All GHL endpoints and embed codes MUST remain functional:

**Form Integration:**
```javascript
// Located in: CRMRegistrationCTA.astro, LeadModal.astro, contact.astro
const formBase = import.meta.env.PUBLIC_GHL_FORM_BASE || 'https://dashboard.zeromotionmarketing.com';
const formId = import.meta.env.PUBLIC_GHL_FORM_ID || 'n9og5xkVVmjupqiLT2R6';
```

**Calendar Integration:**
```javascript
// Located in: StrategistModal.astro, ModernBookingModal.astro
const widgetBase = import.meta.env.PUBLIC_WIDGET_BASE || 'https://link.zeromotionmarketing.com';
const calendarId = import.meta.env.PUBLIC_GHL_CALENDAR_ID || 'fr87zeXsZz80Eg05tQEV';
```

**GHL Preconnects in BaseLayout.astro:**
```html
<link rel="preconnect" href="https://app.gohighlevel.com" crossorigin />
<link rel="preconnect" href="https://api.gohighlevel.com" crossorigin />
```

### 3. Site Structure
- ✋ **Keep the existing layout and section order**
- ✋ **Maintain current navigation structure**
- ✋ **Preserve all existing pages and routes**

---

## 🎯 Optimization Objectives

### Performance Targets
- 🎯 **Lighthouse Mobile Score:** 90+
- 🎯 **Lighthouse Desktop Score:** 90+
- 🎯 **Total Requests:** < 30
- 🎯 **Page Size:** < 1MB (excluding videos)
- 🎯 **First Contentful Paint:** < 1.5s
- 🎯 **Cumulative Layout Shift:** 0 (no layout shift)
- 🎯 **Largest Contentful Paint:** < 2.5s

### Conversion Targets
- ✅ High-contrast CTA above the fold
- ✅ Lead magnet section (e.g., "Get Our Free Funnel Audit PDF")
- ✅ Trust signals (testimonials, results, client logos)
- ✅ Sticky mobile CTA bar
- ✅ Clear value proposition
- ✅ Multiple conversion paths

---

## 📝 Detailed Task Breakdown

### Task 1: Enhance Hero Section (Priority: HIGH)
**File:** `src/components/Hero.astro`

**Current State:**
- Video background at `/photos/homepage_hero.mp4`
- Two CTAs: "View Pricing" and "Take Our Quiz"
- Tagline: "Precision in Motion."

**Optimization Requirements:**
1. **Make primary CTA more prominent:**
   - Increase size and contrast of "Book Free Strategy Call" button
   - Add urgency indicator ("Limited spots available" or "Free 30-min consultation")
   - Consider adding a small benefit list under the CTA

2. **Improve value proposition:**
   - Make headline more benefit-driven (keep personality)
   - Add sub-headline with specific results/outcomes
   - Consider: "Get 3X More Leads in 90 Days with AI-Powered Marketing"

3. **Visual hierarchy:**
   - Ensure CTA contrast ratio meets WCAG AAA
   - Add subtle animation to draw eye to CTA (respect prefers-reduced-motion)
   - Test button colors for maximum visibility (maintain brand)

4. **Mobile optimization:**
   - Ensure buttons stack properly on mobile (already done, verify)
   - Increase touch target sizes (min 44x44px)

**Technical Notes:**
- Video is already optimized with hardware acceleration
- Keep existing video settings (brightness, contrast, saturation)
- Maintain TransparentLogo component

---

### Task 2: Add Lead Magnet Section (Priority: HIGH)
**Create:** `src/components/LeadMagnetSection.astro`

**Requirements:**
1. **Section Content:**
   - Headline: "Get Your Free Digital Marketing Funnel Audit"
   - Sub-headline: "Discover exactly where you're losing leads (and how to fix it)"
   - Benefit bullets:
     - ✓ Identify conversion leaks in your current funnel
     - ✓ Get personalized recommendations from our team
     - ✓ See examples of how we've helped Louisiana businesses
   - CTA: "Download Free Audit Checklist"

2. **GHL Form Integration:**
   ```astro
   ---
   const formBase = import.meta.env.PUBLIC_GHL_FORM_BASE || 'https://dashboard.zeromotionmarketing.com';
   const leadMagnetFormId = import.meta.env.PUBLIC_GHL_LEAD_MAGNET_FORM_ID || 'n9og5xkVVmjupqiLT2R6'; // Use existing for now
   ---
   ```

3. **Design Requirements:**
   - Match existing section styling (dark background, glass effect)
   - Use similar card design as Services section
   - Include form embed or button that opens LeadModal
   - Add subtle background texture or gradient

4. **Placement:**
   - Insert in `src/pages/index.astro` after Hero section
   - Before ImplementationHierarchySection

**Visual Style Reference:**
- Follow the pattern from `CRMRegistrationCTA.astro` (lines 90-232)
- Use `crm-cta-button` style as template
- Maintain purple gradient theme

---

### Task 3: Add Trust & Social Proof Section (Priority: HIGH)
**Create:** `src/components/TrustSection.astro`

**Requirements:**
1. **Client Results (if available):**
   ```astro
   const results = [
     { metric: "3X", label: "Average Lead Increase", client: "Houma Businesses" },
     { metric: "90%", label: "Client Retention Rate", client: "Year over Year" },
     { metric: "30+", label: "Louisiana Businesses Served", client: "Across Terrebonne Parish" }
   ];
   ```

2. **Client Logos:**
   - Use images from `/public/assets/implementation/`:
     - `brisclothing.png`
     - `godspeedbulldogs.png`
     - `southsidemobile.png`
     - `cursed ink.png`
     - `maxline.png`
   - Display in a horizontal scrolling row (mobile) or grid (desktop)
   - Add subtle grayscale filter, color on hover

3. **Testimonial Structure (Placeholder):**
   ```astro
   const testimonials = [
     {
       quote: "ZeroMotion transformed our online presence...",
       author: "Business Owner",
       business: "Local Louisiana Company",
       result: "Increased leads by 200%"
     }
   ];
   ```

4. **Trust Badges:**
   - "Louisiana-Based Support"
   - "No Setup Fees"
   - "AI-Powered Automation"
   - "GDPR & CCPA Compliant"

5. **Design:**
   - Dark card with border (`border-white/20`)
   - Purple accent highlights
   - Testimonial cards with avatar placeholders
   - Responsive grid layout

6. **Placement:**
   - Insert in `src/pages/index.astro` after Services section
   - Before CRMRegistrationCTA

---

### Task 4: Image Optimization (Priority: CRITICAL)
**Goal:** Convert 51 PNGs + 24 JPGs to modern formats

**Strategy:**
1. **Create Optimized Versions:**
   - Generate WebP versions of all images (90% quality)
   - Generate AVIF versions for critical images (85% quality)
   - Keep original as fallback

2. **Priority Images (Do These First):**
   - `/brand/ZeroMotion-Outline.png` (used in header, frequently loaded)
   - `/brand/ZeroMotion-Layerstyle.png` (footer logo)
   - `/favico/android-chrome-512x512.png` (OG image, favicon)
   - `/photos/homepage_hero.mp4` (hero video - already good)
   - Client implementation images in `/assets/implementation/`

3. **Implementation Pattern:**
   ```astro
   <picture>
     <source srcset="/path/image.avif" type="image/avif" />
     <source srcset="/path/image.webp" type="image/webp" />
     <img src="/path/image.png" alt="Description" loading="lazy" width="800" height="600" />
   </picture>
   ```

4. **Lazy Loading:**
   - All images below fold should have `loading="lazy"`
   - Critical images (hero, logo) should be `loading="eager"` or preloaded
   - Already implemented in BaseLayout.astro (lines 79-80)

5. **Tools:**
   - Use Sharp (already in Astro) or create script in `/scripts/optimize-images.js`
   - Or use: `npm run optimize:images` (check if exists)

6. **Responsive Images:**
   - Generate multiple sizes for large images (320w, 640w, 1024w, 1920w)
   - Use `srcset` for responsive loading
   ```html
   srcset="/img-320.webp 320w, /img-640.webp 640w, /img-1024.webp 1024w"
   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   ```

---

### Task 5: JavaScript Bundle Optimization (Priority: HIGH)

**Current Issues:**
- Sentry client: 249KB (very large)
- Total client JS: ~440KB combined

**Optimization Strategies:**

1. **Lazy Load Sentry:**
   ```astro
   <!-- In BaseLayout.astro, line 333-337 -->
   {import.meta.env.SENTRY_DSN && (
     <script type="module">
       // Only load Sentry on error or after 5 seconds
       setTimeout(() => import('/sentry.client.config.js'), 5000);
     </script>
   )}
   ```

2. **Code Splitting (already configured but verify):**
   - Check `astro.config.mjs` lines 68-73 for manualChunks
   - Ensure React/Three.js are only loaded where needed

3. **Remove Unused Dependencies:**
   - Check if Three.js (`@react-three/fiber`, `@react-three/drei`) is actually used
   - If not used, remove from package.json
   - Check for unused Framer Motion animations

4. **Defer Non-Critical Scripts:**
   ```html
   <script type="module" defer>
     // Non-critical functionality
   </script>
   ```

5. **Optimize Analytics:**
   - GTM is already lazy-loaded via Analytics component
   - Verify EventTracker.astro isn't loaded until needed

---

### Task 6: Mobile Sticky CTA Bar (Priority: HIGH)
**Create:** `src/components/MobileStickyCTA.astro`

**Requirements:**
1. **Visibility:**
   - Only show on mobile (< 768px)
   - Fixed position at bottom of screen
   - Slide in after user scrolls past hero (IntersectionObserver)
   - Respect safe-area-inset-bottom for iOS notches

2. **Content:**
   - Primary action: "Book Free Call" → opens StrategistModal
   - Secondary action: "Get Free Audit" → opens LeadModal
   - Or single prominent CTA: "Get Started - Free Consultation"

3. **Design:**
   ```astro
   <style>
     .mobile-sticky-cta {
       position: fixed;
       bottom: 0;
       left: 0;
       right: 0;
       z-index: 40; /* Below navbar (50) */
       padding: var(--space-3) var(--space-4);
       padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom));
       background: linear-gradient(135deg, #6E00FF, #4B00FF);
       border-top: 1px solid rgba(255,255,255,0.2);
       box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
       transform: translateY(100%);
       transition: transform 0.3s ease;
     }
     
     .mobile-sticky-cta.visible {
       transform: translateY(0);
     }
     
     .mobile-sticky-cta button {
       width: 100%;
       padding: var(--space-4);
       font-size: 1.0625rem;
       font-weight: 600;
       border-radius: var(--radius-lg);
       background: white;
       color: #6E00FF;
       border: none;
       box-shadow: 0 2px 8px rgba(0,0,0,0.2);
     }
   </style>
   ```

4. **JavaScript:**
   ```javascript
   <script>
     // Show after scrolling past hero
     const hero = document.querySelector('[data-hero]');
     const stickyCTA = document.querySelector('.mobile-sticky-cta');
     
     if (hero && stickyCTA && window.innerWidth < 768) {
       const observer = new IntersectionObserver(([entry]) => {
         stickyCTA.classList.toggle('visible', !entry.isIntersecting);
       }, { threshold: 0 });
       
       observer.observe(hero);
     }
   </script>
   ```

5. **Integration:**
   - Add to `BaseLayout.astro` after `<Footer />`
   - Should trigger existing modal components (StrategistModal or LeadModal)

---

### Task 7: SEO Enhancements (Priority: MEDIUM)

**Files to Update:**
- `src/pages/index.astro` (homepage)
- `src/layouts/BaseLayout.astro` (global)
- All component .astro files (alt text)

**Checklist:**

1. **Homepage Title & Meta (index.astro):**
   ```astro
   ---
   const title = "Digital Marketing Agency Houma LA | AI-Powered Web Design | ZeroMotion";
   const description = "ZeroMotion Marketing: Louisiana's premier AI-powered digital marketing agency. Get 3X more leads with professional web design, automation, and local SEO. Serving Houma, Thibodaux, and Terrebonne Parish. Free consultation.";
   ```

2. **Heading Structure Audit:**
   - Verify single H1 per page
   - Check H2-H6 hierarchy (no skipping levels)
   - Current Hero H1: "Precision in Motion." (keep or improve)

3. **Alt Text Review:**
   - All images must have descriptive alt text
   - Client logo alts: "Client logo: [Business Name]"
   - Decorative images: `alt=""` or `aria-hidden="true"`
   
   **Priority Alt Text Updates:**
   ```astro
   // Hero (Hero.astro line 25)
   aria-label="Background video showcasing ZeroMotion's AI-powered digital marketing services and web design work for Louisiana businesses"
   
   // Footer logo (Footer.astro line 18)
   alt="ZeroMotion Marketing logo - Digital marketing agency serving Houma and Thibodaux, Louisiana"
   ```

4. **Structured Data:**
   - Already implemented (BaseLayout.astro lines 248-324)
   - Verify LocalBusiness schema is correct
   - Add FAQ schema if Q&A section exists

5. **Internal Linking:**
   - Add contextual links within content
   - Link to service pages from homepage descriptions
   - Ensure all pages accessible within 3 clicks

---

### Task 8: Additional Performance Optimizations

1. **Font Loading:**
   - Already using font-display: swap (global.css line 239)
   - Preloading Inter font (BaseLayout.astro lines 73-84)
   - ✅ VERIFIED - No changes needed

2. **Critical CSS:**
   - Already inlined (BaseLayout.astro lines 154-241)
   - ✅ VERIFIED - No changes needed

3. **Preconnects:**
   - Already configured for GHL, GTM, fonts
   - ✅ VERIFIED - No changes needed

4. **Service Worker / PWA:**
   - File exists at `/public/sw.js`
   - Verify it's working or disable if not used

5. **Video Optimization:**
   - Hero video is already optimized
   - Service cards use `preload="metadata"` ✅
   - All videos have `playsinline muted loop autoplay`

---

## 🧰 Technical Reference

### Key Files

**Core Pages:**
```
src/pages/index.astro          → Homepage (main optimization target)
src/pages/pricing.astro        → Pricing page
src/pages/quiz.astro           → Quiz page (GHL form)
src/pages/contact.astro        → Contact page (GHL form)
```

**Layout:**
```
src/layouts/BaseLayout.astro   → Global layout, head tags, analytics
```

**Components:**
```
src/components/Hero.astro                     → Hero section (Task 1)
src/components/Services.astro                 → Services grid
src/components/CRMRegistrationCTA.astro       → Quiz CTA
src/components/ImplementationHierarchySection.astro → Process timeline
src/components/Navbar.astro                   → Header navigation
src/components/Footer.astro                   → Footer with trust signals
src/components/StrategistModal.astro          → Booking modal (GHL calendar)
src/components/LeadModal.astro                → Lead form modal (GHL form)
```

**Styling:**
```
src/styles/global.css          → Design tokens, utility classes
```

**Config:**
```
astro.config.mjs               → Build config, performance settings
vercel.json                    → Deployment config, headers, redirects
```

### Environment Variables (GHL)

**Required in Vercel:**
```env
PUBLIC_GHL_FORM_BASE=https://dashboard.zeromotionmarketing.com
PUBLIC_GHL_FORM_ID=n9og5xkVVmjupqiLT2R6
PUBLIC_GHL_CAL_BASE=https://link.zeromotionmarketing.com
PUBLIC_GHL_CALENDAR_ID=fr87zeXsZz80Eg05tQEV
PUBLIC_WIDGET_BASE=https://link.zeromotionmarketing.com
```

### Design Tokens Reference

```css
/* From src/styles/global.css */

/* Colors */
--zm-bg: #0d0d1a;              /* Background */
--zm-surface: #1a1a2e;          /* Cards/panels */
--zm-primary: #8b5cf6;          /* Purple accent */
--zm-accent: #fbbf24;           /* Yellow accent */
--zm-text: #ffffff;             /* Primary text */
--zm-text-muted: #b8b8c0;       /* Secondary text */

/* Spacing */
--zm-gap-xs: 4px;
--zm-gap-sm: 8px;
--zm-gap-md: 16px;
--zm-gap-lg: 24px;
--zm-gap-xl: 32px;

/* Border Radius */
--zm-radius: 8px;
--zm-radius-lg: 12px;
--zm-radius-xl: 16px;

/* Typography */
--zm-h1: clamp(2.5rem, 5vw, 4rem);
--zm-h2: clamp(2rem, 4vw, 3rem);
```

---

## ✅ Acceptance Criteria

### Performance
- [ ] Lighthouse Mobile Score ≥ 90
- [ ] Lighthouse Desktop Score ≥ 90
- [ ] Total requests < 30
- [ ] Page weight < 1MB (excluding videos)
- [ ] CLS score = 0
- [ ] LCP < 2.5s

### Conversion
- [ ] Hero CTA is prominent and high-contrast
- [ ] Lead magnet section added with GHL form
- [ ] Trust section with client logos and results
- [ ] Mobile sticky CTA bar implemented
- [ ] All GHL forms/calendars still functional

### Code Quality
- [ ] Build passes without errors
- [ ] All links work
- [ ] Console is clean (no errors)
- [ ] Mobile and desktop tested
- [ ] Respects prefers-reduced-motion
- [ ] WCAG AA compliant (color contrast, touch targets)

### Preservation
- [ ] All custom backgrounds/media intact
- [ ] Design aesthetic unchanged
- [ ] GHL integration working
- [ ] Existing site structure maintained

---

## 🚀 Execution Workflow

**Recommended Order:**
1. ✅ Task 1: Enhance Hero (quick win, high impact)
2. ✅ Task 2: Add Lead Magnet section (conversion boost)
3. ✅ Task 7: Mobile Sticky CTA (mobile conversion)
4. ✅ Task 3: Trust section (credibility)
5. ✅ Task 4: Image optimization (biggest perf gain)
6. ✅ Task 5: JS optimization (perf gain)
7. ✅ Task 6: SEO enhancements (organic traffic)
8. ✅ Task 8: Final audit and polish

**Testing Between Tasks:**
```bash
npm run build
npm run preview
# Then test manually in browser
```

**Performance Testing:**
```bash
# Lighthouse
npm run perf:lighthouse

# Or use Chrome DevTools:
# 1. Open DevTools
# 2. Lighthouse tab
# 3. Run Mobile + Desktop audits
```

---

## 📞 Questions & Edge Cases

**Q: What if I don't have testimonials or specific results?**
A: Use placeholder structure with representative data. Focus on trust badges (Louisiana-based, no setup fees, etc.) and client logos.

**Q: Should I modify the video?**
A: No. Keep the hero video as-is. It's already optimized with hardware acceleration.

**Q: Can I change button styles?**
A: Yes, but maintain the purple gradient brand theme. Increase size/contrast but keep the style personality.

**Q: What about Three.js (React 3D)?**
A: Check if it's actually used. If not found in components, remove from package.json.

**Q: How aggressive on image optimization?**
A: Very aggressive. Convert ALL images to WebP minimum. AVIF for critical images. Original as fallback only.

---

## 📦 Deliverables

1. **Optimized Homepage** (`src/pages/index.astro`)
   - Enhanced hero
   - New lead magnet section
   - New trust section
   - Mobile sticky CTA

2. **New Components:**
   - `LeadMagnetSection.astro`
   - `TrustSection.astro`
   - `MobileStickyCTA.astro`

3. **Optimized Images:**
   - WebP versions of all PNGs/JPGs
   - AVIF for critical images
   - Updated `<picture>` tags with fallbacks

4. **Performance Report:**
   - Before/after Lighthouse scores
   - Bundle size comparison
   - Load time improvements

5. **Test Checklist:**
   - All GHL forms working
   - All modals opening correctly
   - Mobile responsiveness
   - No console errors
   - No layout shift

---

## 🎯 Success Metrics

**Before (Baseline):**
- Mobile Score: Unknown (likely 70-80)
- Desktop Score: Unknown (likely 80-90)
- Client JS: 440KB
- Images: 51 PNGs + 24 JPGs (unoptimized)
- No lead magnet
- No visible trust signals above fold
- No mobile sticky CTA

**After (Target):**
- Mobile Score: 90+
- Desktop Score: 90+
- Client JS: <300KB
- Images: WebP/AVIF with fallbacks
- Lead magnet section with GHL form
- Trust section with client logos
- Mobile sticky CTA bar
- Zero layout shift

---

## 💡 Pro Tips

1. **Test GHL forms early** - Don't break the integration
2. **Use Chrome DevTools** - Lighthouse, Network tab, Performance tab
3. **Test on real mobile device** - Emulators don't catch everything
4. **Commit frequently** - Git commit after each major change
5. **Keep backups** - Copy original files before major changes
6. **Respect the design** - Enhance, don't replace
7. **Think conversion first** - Every change should help business goals

---

**Good luck! You're enhancing a solid foundation. Focus on performance and conversion without losing the unique ZeroMotion personality.** 🚀

