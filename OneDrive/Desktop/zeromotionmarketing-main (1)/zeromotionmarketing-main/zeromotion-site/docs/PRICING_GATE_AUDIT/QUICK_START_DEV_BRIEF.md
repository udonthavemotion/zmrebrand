# QUICK START: PRICING GATE VISUAL CHANGES
## For Developer - Ship Tonight (2-4 Hours)

**Date:** October 25, 2025  
**Goal:** Make visible pricing gate changes that can be seen live on https://zeromotionmarketing.com/ tonight

---

## 🎯 TONIGHT'S SCOPE: HIGH-IMPACT VISUAL CHANGES

Focus on **visual/UX changes only**. Skip backend automation for now.

### Success Criteria
- [ ] Pricing page shows softened ranges (not exact numbers)
- [ ] CTAs trigger modals instead of linking to plan pages
- [ ] Social proof visible above pricing cards
- [ ] Updated FAQ copy with lead capture language
- [ ] Changes deployed and live

**Time Estimate:** 2-4 hours (depending on deployment process)

---

## 📝 TASK CHECKLIST (In Priority Order)

### ✅ TASK 1: Update Pricing Ranges (15 minutes)
**File:** `zeromotion-site/src/data/packages.ts`

**Current Code (Lines 16-97):**
```typescript
export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Website",
    priceRange: "$200–$300 build + $75–$100/mo", // ❌ TOO SPECIFIC
    // ...
  },
  {
    id: "growth",
    name: "Growth Marketing",
    priceRange: "$1,000–$1,500 setup + $150–$300/mo", // ❌ TOO SPECIFIC
    // ...
  },
  {
    id: "scale",
    name: "Scale & Dominate",
    priceRange: "$2,000–$5,000+/mo", // ❌ TOO SPECIFIC
    // ...
  }
];
```

**NEW CODE (Replace with):**
```typescript
export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Website",
    priceRange: "Starting at $200", // ✅ SOFTENED
    description: "Get online fast with a professional website. Custom quote based on your needs.",
    // ... keep rest same
  },
  {
    id: "growth",
    name: "Growth Marketing",
    priceRange: "Starting at $1,000", // ✅ SOFTENED
    description: "Complete marketing automation. Setup + monthly retainer. Custom quote based on your needs.",
    // ... keep rest same
  },
  {
    id: "scale",
    name: "Scale & Dominate",
    priceRange: "Starting at $2,000/mo", // ✅ SOFTENED
    description: "Enterprise-level advertising and automation. Custom quote based on your goals.",
    // ... keep rest same
  }
];
```

---

### ✅ TASK 2: Change Pricing Card CTAs to Modals (20 minutes)
**File:** `zeromotion-site/src/components/pricing/PlanCard.astro`

**Current Code (Lines 76-90):**
```astro
<div class="pt-6 cta">
  <a 
    href={ctaHref}  <!-- ❌ LINKS TO /plans/[tier] -->
    class={`btn ${popular ? "btn-primary" : "btn-ghost"} w-full text-center`}
    onclick={`
      if (window.dataLayer) {
        window.dataLayer.push({event:'select_plan',plan:'${name}'});
      }
    `}
  >
    <span>{ctaText}</span>
  </a>
</div>
```

**NEW CODE (Replace with):**
```astro
<div class="pt-6 cta">
  <button
    type="button"
    class={`btn ${popular ? "btn-primary" : "btn-ghost"} w-full text-center`}
    onclick={`
      openLeadModal('${name.toLowerCase().replace(/\\s+/g, '-')}');
      if (window.dataLayer) {
        window.dataLayer.push({event:'cta_click',label:'Get Quote - ${name}'});
      }
    `}
  >
    <span>Get My Quote</span>  <!-- ✅ CHANGED TEXT -->
  </button>
</div>
```

**Also Update:** Change `ctaText` prop default in PlanCard.astro (line 22):
```typescript
ctaText = "Get My Quote", // WAS: "Get Started"
```

---

### ✅ TASK 3: Add Social Proof Strip Component (30 minutes)
**File:** `zeromotion-site/src/components/SocialProofStrip.astro` (NEW FILE)

**Create new file with this content:**
```astro
---
// Social Proof Strip - Trust signals above pricing
---

<section class="social-proof-strip bg-gradient-to-r from-purple-900/20 to-black py-12 border-y border-white/10">
  <div class="container-page">
    <!-- Metrics Row -->
    <div class="grid md:grid-cols-3 gap-6 text-center mb-8">
      <div class="proof-card">
        <div class="text-4xl font-bold text-purple-400 mb-2">3x</div>
        <div class="text-white/70 text-sm">Average ROI in 90 Days</div>
      </div>
      <div class="proof-card">
        <div class="text-4xl font-bold text-purple-400 mb-2">&lt;24h</div>
        <div class="text-white/70 text-sm">Median Speed-to-Lead</div>
      </div>
      <div class="proof-card">
        <div class="text-4xl font-bold text-purple-400 mb-2">40+</div>
        <div class="text-white/70 text-sm">Louisiana Businesses Trust Us</div>
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="flex flex-wrap justify-center gap-4 text-sm">
      <div class="badge flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
        <span>⭐⭐⭐⭐⭐</span>
        <span class="text-white/80">4.9/5 on Google</span>
      </div>
      <div class="badge flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
        <span>🔒</span>
        <span class="text-white/80">30-Day Satisfaction Guarantee</span>
      </div>
      <div class="badge flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
        <span>📞</span>
        <span class="text-white/80">(985) 303-2016</span>
      </div>
    </div>
  </div>
</section>

<style>
  .proof-card {
    transition: transform 0.3s ease;
  }
  
  .proof-card:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .badge {
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
    }
  }
</style>
```

---

### ✅ TASK 4: Insert Social Proof into Pricing Page (10 minutes)
**File:** `zeromotion-site/src/pages/pricing.astro`

**Add import (after line 6):**
```astro
import SocialProofStrip from "../components/SocialProofStrip.astro";
```

**Insert component (after hero section, around line 101, before pricing cards):**
```astro
</section>

<!-- NEW: Social Proof Strip -->
<SocialProofStrip />

<!-- Pricing Cards Section with dedicated high-quality video -->
<BackgroundSectionVideo
```

---

### ✅ TASK 5: Update Pricing Page Hero CTA (5 minutes)
**File:** `zeromotion-site/src/pages/pricing.astro`

**Current Code (Lines 84-99):**
```astro
<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
  <a 
    href="#plans" 
    class="btn-primary btn-lg"
  >
    <span class="btn-text-main">Pick Your Plan</span>
  </a>
  <button
    type="button"
    class="btn-ghost btn-lg"
    onclick="openStrategistModal('pricing-hero')"
  >
    <span class="btn-text-main">Talk to a Strategist</span>
  </button>
</div>
```

**NEW CODE (Replace with):**
```astro
<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
  <button
    type="button"
    class="btn-primary btn-lg"
    onclick="openLeadModal('pricing-hero'); window.dataLayer&&dataLayer.push({event:'cta_click',label:'Get My Quote'})"
  >
    <span class="btn-text-main">Get My Quote</span>
  </button>
  <button
    type="button"
    class="btn-ghost btn-lg"
    onclick="openStrategistModal('pricing-hero'); window.dataLayer&&dataLayer.push({event:'cta_click',label:'Talk to Strategist'})"
  >
    <span class="btn-text-main">Talk to a Strategist</span>
  </button>
</div>
```

---

### ✅ TASK 6: Update FAQ Copy (15 minutes)
**File:** `zeromotion-site/src/components/pricing/FAQBlock.astro`

**Add these 3 new FAQs (or update existing ones):**

```astro
<!-- Add to existing FAQ list -->
<div class="faq-item">
  <h3>How is pricing determined?</h3>
  <p>We price based on your business size, campaign complexity, and monthly ad spend. Most Louisiana businesses fit our <strong>Growth plan</strong> (starting at $1,000 setup + $150/month). <button onclick="openLeadModal('faq')" class="text-purple-400 underline">Request a custom quote</button> to see exactly what you'll pay.</p>
</div>

<div class="faq-item">
  <h3>Can I see a detailed breakdown before I commit?</h3>
  <p>Absolutely. When you request a quote, we'll show you line-item pricing, what's included, projected ROI, and a sample timeline. No commitment required. <button onclick="openLeadModal('faq')" class="text-purple-400 underline">Get your quote →</button></p>
</div>

<div class="faq-item">
  <h3>Do you offer payment plans?</h3>
  <p>Yes. We offer monthly retainers (no long-term contracts) and 2-3 month setup payment plans for qualified businesses. <button onclick="openStrategistModal('faq')" class="text-purple-400 underline">Discuss options with our team →</button></p>
</div>
```

---

### ✅ TASK 7: Update Pricing Page Subhead (5 minutes)
**File:** `zeromotion-site/src/pages/pricing.astro`

**Current Code (Line 82-83):**
```astro
<p class="text-white/85 max-w-2xl mx-auto text-lg">
  Founded in Louisiana, built for anyone, anywhere. AI-first execution. Start with what you need—upgrade when you're ready.
</p>
```

**NEW CODE (Replace with):**
```astro
<p class="text-white/85 max-w-2xl mx-auto text-lg">
  See our transparent pricing ranges below, then unlock your custom quote with a 2-minute form. We'll show you exactly what you'll pay and what ROI to expect.
</p>
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deploy Testing (Local)
- [ ] Run `npm run dev` and test at http://localhost:4321/pricing
- [ ] Click "Get My Quote" button → LeadModal should open
- [ ] Verify social proof strip displays correctly
- [ ] Test on mobile (Chrome DevTools mobile view)
- [ ] Check console for errors (should be none)
- [ ] Verify pricing ranges show "Starting at $X" (not exact ranges)

### Deploy to Production
- [ ] Commit changes: `git add .`
- [ ] Commit message: `feat(pricing): implement pricing gate phase 1 - visual changes`
- [ ] Push to main: `git push origin main`
- [ ] Verify Vercel auto-deploys (check Vercel dashboard)
- [ ] Wait for deployment to complete (~2-3 minutes)
- [ ] Test live site: https://zeromotionmarketing.com/pricing

### Post-Deploy Verification
- [ ] Visit live pricing page
- [ ] Click all "Get My Quote" buttons
- [ ] Verify modals open correctly
- [ ] Test on real mobile device (iPhone/Android)
- [ ] Check Google Search Console (pricing should still be indexed)
- [ ] Take screenshot for before/after comparison

---

## 📸 VISUAL COMPARISON

### BEFORE (Current State)
- Pricing cards show: "$1,000–$1,500 setup + $150–$300/mo"
- CTA buttons link to `/plans/growth` (separate pages)
- No social proof above pricing
- Hero CTA: "Pick Your Plan"

### AFTER (Tonight's Changes)
- Pricing cards show: "Starting at $1,000"
- CTA buttons open LeadModal (no page navigation)
- Social proof strip with metrics (3x ROI, <24h speed, 40+ businesses)
- Hero CTA: "Get My Quote"
- Updated FAQ with lead capture CTAs

---

## ⏱️ TIME BREAKDOWN

| Task | Estimated Time |
|------|---------------|
| 1. Update pricing ranges | 15 min |
| 2. Change CTAs to modals | 20 min |
| 3. Create SocialProofStrip | 30 min |
| 4. Insert into pricing page | 10 min |
| 5. Update hero CTA | 5 min |
| 6. Update FAQ copy | 15 min |
| 7. Update subhead | 5 min |
| **Testing & Deploy** | 30 min |
| **TOTAL** | **~2.5 hours** |

---

## 🆘 TROUBLESHOOTING

### Issue: Modal doesn't open
**Fix:** Verify `LeadModal.astro` is imported in `BaseLayout.astro` and `openLeadModal()` function exists in global scope.

### Issue: Vercel deployment fails
**Fix:** Check build logs in Vercel dashboard. Common issue: missing import or TypeScript error.

### Issue: Pricing ranges still showing exact numbers
**Fix:** Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R). Verify `packages.ts` changes were committed.

### Issue: Social proof strip looks broken on mobile
**Fix:** Check Tailwind responsive classes. Add `text-center` to mobile breakpoints.

---

## 📞 SUPPORT

**Questions?** Reference:
- Full audit: `zeromotion-site/docs/PRICING_GATE_AUDIT/README.md`
- Technical specs: `zeromotion-site/docs/PRICING_GATE_AUDIT/07_TECHNICAL_IMPLEMENTATION.md`
- Page analysis: `zeromotion-site/docs/PRICING_GATE_AUDIT/02_PAGE_ANALYSIS.md`

**Stuck?** Call owner or senior dev for approval/guidance.

---

## ✅ DEFINITION OF DONE (TONIGHT)

- [ ] Code changes committed and pushed
- [ ] Vercel deployment successful
- [ ] Live pricing page shows softened ranges
- [ ] "Get My Quote" buttons open modal
- [ ] Social proof strip visible
- [ ] FAQ updated with lead capture language
- [ ] Owner reviewed and approved visual changes
- [ ] Screenshot taken for documentation

---

**Ship it tonight. Iterate tomorrow. 🚀**

**Next Phase:** GHL automation setup (Week 3) - see `05_GHL_AUTOMATION.md`

