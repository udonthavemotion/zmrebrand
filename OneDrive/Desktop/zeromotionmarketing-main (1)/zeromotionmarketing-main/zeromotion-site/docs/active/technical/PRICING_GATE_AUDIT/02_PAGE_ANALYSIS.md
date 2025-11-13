# PAGE-BY-PAGE ANALYSIS & REDLINES
## ZeroMotion Marketing Website Audit

**Audit Date:** October 25, 2025

---

## 📑 SITE STRUCTURE INVENTORY

| URL | Template | Primary Goal | Current CTA | Friction Points | Proof Assets | Intent |
|-----|----------|-------------|-------------|----------------|-------------|---------|
| `/` | Homepage | Brand awareness + routing | "View Pricing", "Get ZeroMotion CRM" | No lead capture above fold | Logo, brand video | High (Existing aware) |
| `/pricing` | Pricing page | Convert to lead | "Pick Your Plan", "Talk to Strategist" | **PRICING 100% VISIBLE** | Price ranges, workflow images | Very High |
| `/plans/starter` | Plan detail | Convert to specific tier | "Start Growth", "Talk to Strategist" | **Exact pricing visible**, no calculator | Feature list | Very High |
| `/plans/growth` | Plan detail | Convert to specific tier | "Start Growth", "Talk to Strategist" | **Exact pricing visible** | Feature list, testimonials | Very High |
| `/plans/scale` | Plan detail | Convert to specific tier | "Start Growth", "Talk to Strategist" | **Exact pricing visible** | Feature list | Very High |
| `/services/web-design` | Service page | Educate + convert | "Get Started", "Book Consultation" | No pricing context | Portfolio examples (assumed) | Medium-High |
| `/services/brand-identity` | Service page | Educate + convert | "Get Started", "Book Consultation" | Unclear pricing tier fit | Branding samples (assumed) | Medium |
| `/services/ai-integration` | Service page | Educate + convert | "Get Started", "Book Consultation" | Technical jargon risk | Use cases (assumed) | Medium |
| `/services/crm` | Service page | Convert to GHL setup | "Get ZeroMotion CRM" | Pricing ambiguity | GHL features | Medium-High |
| `/about` | About | Build trust | "Contact Us" | Weak CTA | Team, mission, local focus | Low-Medium |
| `/contact` | Contact | Convert to lead | "Submit Form" | Generic form, no incentive | Contact info | Medium-High |
| Footer | Global | Support + compliance | "Privacy", "Terms" | No secondary CTA | Trust badges (assumed) | N/A |
| 404 | Error | Recover session | None visible | Dead end | None | Recovery |

---

## 🏠 HOMEPAGE (`/`)

### Current State
**H1:** "Precision in Motion."  
**Subhead:** "AI-powered execution for growing businesses—start simple, scale smart."  
**Hero CTAs:** "View Pricing" (primary) | "Get ZeroMotion CRM" (secondary)  
**Proof:** Logo animation, background video (homepage_hero.mp4)  
**Sections:** Hero → Implementation Hierarchy → Choice Section → Services → CRM Registration CTA

### Issues
1. ❌ No above-fold lead capture (only navigation to pricing)
2. ❌ "View Pricing" CTA drives traffic to fully exposed pricing page
3. ❌ No value proposition for *why* to engage
4. ❌ Missing social proof (no logos, no review score, no quantified outcomes)
5. ❌ No low-commitment lead magnet offer
6. ⚠️ Hero video loads slowly on mobile (80MB+ video)

### Redline Recommendations

**H1 (Keep, Refine):**
```
Precision in Motion—Stop Losing Leads to Slow Websites & Invisible Marketing.
```

**Subhead (Strengthen):**
```
Louisiana businesses choose ZeroMotion for AI-powered websites, funnels, and ad campaigns that drive real revenue—not vanity metrics. See what's possible in 30 days.
```

**Hero CTA (Replace):**
```
PRIMARY: "Get My Custom Quote" → Opens LeadModal with 2-step form
SECONDARY: "See Our Work" → Scroll to case study carousel (add)
```

**Add Above Fold (Credibility Strip):**
```
[Logo Grid: 6 Louisiana client logos OR "Trusted by 40+ Louisiana Businesses"]
[Trust Badge: "⭐⭐⭐⭐⭐ 4.9/5 on Google" OR "Avg. 3x ROI in 90 Days"]
[Guarantee: "30-Day Satisfaction Guarantee | Cancel Anytime"]
```

**Add Section (After Hero):**
```
<div class="bg-gradient-to-r from-purple-900/20 to-black py-12">
  <div class="container-page">
    <div class="grid md:grid-cols-3 gap-6 text-center">
      <div>
        <div class="text-4xl font-bold text-primary mb-2">3x</div>
        <div class="text-white/70">Average ROI in 90 Days</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-primary mb-2"><24h</div>
        <div class="text-white/70">Median Speed-to-Lead</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-primary mb-2">40+</div>
        <div class="text-white/70">Louisiana Businesses Trust Us</div>
      </div>
    </div>
  </div>
</div>
```

---

## 💰 PRICING PAGE (`/pricing`)

### Current State
**H1:** "Pricing built for speed and ROI."  
**Subhead:** "Founded in Louisiana, built for anyone, anywhere. AI-first execution. Start with what you need—upgrade when you're ready."  
**Hero CTAs:** "Pick Your Plan" (scroll to cards) | "Talk to a Strategist" (modal)  
**Pricing Cards:** 3 tiers with **EXACT PRICE RANGES FULLY VISIBLE**  
  - **Starter:** "$200–$300 build + $75–$100/mo"
  - **Growth:** "$1,000–$1,500 setup + $150–$300/mo"
  - **Scale:** "$2,000–$5,000+/mo"  
**Sections:** Hero → Pricing Cards → Comparison Table → FAQ → Final CTA

### Issues
1. ❌ **CRITICAL:** All pricing is 100% exposed—no gate whatsoever
2. ❌ No lead capture requirement to see pricing details
3. ❌ Comparison table shows every feature by tier
4. ❌ FAQ answers pricing questions without lead exchange
5. ❌ Schema markup broadcasts pricing to Google (rich snippets)
6. ❌ No progressive disclosure or value-based calculator
7. ⚠️ "Talk to a Strategist" CTA opens calendar, not form (good for qualified, bad for top-funnel)

### Redline Recommendations

**H1 (Reframe):**
```
Get Pricing Tailored to Your Business—No Two Louisiana Companies Are the Same.
```

**Subhead (Value Exchange):**
```
See our transparent pricing ranges below, then unlock your custom quote with a 2-minute form. We'll show you exactly what you'll pay and what ROI to expect.
```

**Hero CTAs (Modify):**
```
PRIMARY: "Get My Custom Quote" → Opens LeadModal (2-step form)
SECONDARY: "See Pricing Ranges" → Scroll to revised cards (see below)
```

**Pricing Cards (Revise to Show Ranges, Gate Details):**

```astro
<!-- BEFORE (Current) -->
<PlanCard
  name="Growth Marketing"
  priceRange="$1,000–$1,500 setup + $150–$300/mo"  <!-- TOO SPECIFIC -->
  features={["Funnels + GHL automations", "GBP optimization + posts", ...]}
  ctaText="See details"
  ctaHref="/plans/growth"  <!-- Links to page with more pricing -->
/>

<!-- AFTER (Recommended) -->
<PlanCard
  name="Growth Marketing"
  priceRange="Starting at $1,000"  <!-- Softened range -->
  description="Complete marketing automation. Setup + monthly retainer. Custom quote based on your needs."
  features={["Funnels + GHL automations", "GBP optimization + posts", ...]}
  ctaText="Get My Quote"
  ctaOnClick="openLeadModal('growth-plan')"  <!-- Modal, not link -->
  badge="Most Popular"
/>
```

**Comparison Table (Gate It):**
- Remove full comparison table from `/pricing`
- Add teaser: "See full feature comparison when you request your quote"
- Move full table to post-submit thank-you page or email

**FAQ (Revise to Drive Lead Capture):**

```markdown
### OLD FAQ (Too Much Info)
**Q:** How much does the Growth plan cost?
**A:** Setup ranges from $1,000-$1,500, and monthly retainers are $150-$300 depending on scope.

### NEW FAQ (Gates Details)
**Q:** How is pricing determined?
**A:** We price based on your business size, campaign complexity, and monthly ad spend. Most Louisiana businesses fit our Growth plan (starting at $1,000 setup). **[Get your custom quote in 2 minutes →](#lead-modal)**

**Q:** Can I see a detailed breakdown?
**A:** Absolutely. When you request a quote, we'll show you exactly what's included, what you'll pay, and projected ROI based on businesses like yours. **[Get started →](#lead-modal)**

**Q:** Do you offer payment plans?
**A:** Yes. We offer flexible monthly retainers and can structure setup costs over 2-3 months for qualified businesses. **[Discuss options with our team →](#strategist-modal)**
```

**Schema Markup (Update to Avoid Broadcasting Exact Pricing):**

```json
// BEFORE (Current - broadcasts exact prices)
{
  "@type": "Offer",
  "priceRange": "$1,000-$1,500 setup + $150-$300/mo",  // TOO SPECIFIC
  "priceCurrency": "USD"
}

// AFTER (Recommended - vague range)
{
  "@type": "Offer",
  "priceSpecification": {
    "@type": "PriceSpecification",
    "priceCurrency": "USD",
    "price": "1000",
    "minPrice": "1000",
    "description": "Custom pricing based on business needs. Starting at $1,000."
  },
  "availability": "https://schema.org/InStock",
  "url": "https://zeromotion.marketing/pricing"
}
```

---

## 📄 PLAN DETAIL PAGES (`/plans/starter`, `/plans/growth`, `/plans/scale`)

### Current State
**Example:** `/plans/growth`  
**H1:** "Growth Marketing: funnels + automation that make phones ring."  
**Pricing Display:** "$1,000–$1,500 setup + $150–$300/mo"  
**Hero CTAs:** "Start Growth" (opens LeadModal) | "Talk to a Strategist" (opens StrategistModal)  
**Sections:** Hero → What's Included (feature cards) → Process Steps → Social Proof → Timeline → ROI Calculator (if exists) → FAQ → Final CTA

### Issues
1. ❌ **Pricing still fully visible** on individual plan pages
2. ❌ `/plans/*` URLs are public and indexable—anyone can deep-link
3. ✅ GOOD: CTAs open modals (not external links)
4. ⚠️ No progressive disclosure (all features shown at once)
5. ⚠️ No "calculator" or interactive quote builder

### Redline Recommendations

**Option A: Gate the Entire Page**
- Require email capture before rendering `/plans/growth` content
- Store email in localStorage, allow 7-day access
- Add exit-intent popup if user tries to leave without submitting lead

**Option B: Partial Gate (Recommended)**
- Show high-level features and "Starting at $X"
- Gate detailed breakdown, timeline, and ROI calculator behind 2-step form
- Add progressive disclosure: "Want to see how this works for YOUR business? Tell us a bit about your needs."

**Recommended Structure:**

```astro
<!-- /plans/growth.astro (REVISED) -->

<section id="growth-hero">
  <h1>Growth Marketing: funnels + automation that make phones ring.</h1>
  <p class="price-teaser">Starting at $1,000 setup + monthly retainer</p>  <!-- Softened -->
  <p class="subhead">See your custom quote in 2 minutes—no commitment required.</p>
  
  <div class="cta-group">
    <button onclick="openLeadModal('growth-plan')">Get My Custom Quote</button>
    <button onclick="openStrategistModal('growth-plan')">Talk to a Strategist</button>
  </div>
</section>

<!-- Public Section: High-Level Features -->
<section id="what-includes">
  <h2>What's Included</h2>
  <div class="feature-grid">
    <div class="feature-card">
      <h3>Funnels + Lead Forms</h3>
      <p>Custom-built sales funnels that convert.</p>
    </div>
    <!-- ... more high-level cards ... -->
  </div>
  <div class="cta-gate">
    <p>Want detailed pricing, timelines, and ROI projections?</p>
    <button onclick="openLeadModal('growth-plan-details')">Unlock Full Details</button>
  </div>
</section>

<!-- GATED Section: Detailed Breakdown (Only shows after lead capture) -->
<section id="detailed-breakdown" class="gated-content" style="display:none;" data-requires-lead="true">
  <h2>Your Custom Growth Plan Breakdown</h2>
  <!-- Detailed pricing table, timeline, ROI calc -->
</section>
```

**Add Lead-Gated ROI Calculator:**
- "See what Growth Marketing could do for YOUR business"
- Input: Monthly ad spend, current leads/month, current close rate
- Output: Projected leads, revenue increase, ROI (custom formula)
- Requires email to see results

---

## 🎨 SERVICE PAGES (`/services/*`)

### Current State
**Example:** `/services/web-design`  
**H1:** (Unknown—not read in audit)  
**Typical Sections:** Hero → Service Overview → Benefits → Portfolio → Process → Pricing Teaser (?) → CTA  
**CTAs:** "Get Started" (opens modal) | "Book Consultation"

### Issues (Assumed)
1. ⚠️ Unclear which pricing tier each service maps to
2. ⚠️ No explicit pricing context (users must visit `/pricing` separately)
3. ⚠️ No social proof specific to each service
4. ⚠️ No service-specific lead magnets

### Redline Recommendations

**Add "Pricing Fit" Context:**
```
📦 Web Design fits our **Starter** plan (starting at $200)
[Get My Custom Quote →]
```

**Add Service-Specific Lead Magnet:**
```
Before You Hire a Web Designer: Download Our Free 30-Point Website Audit Checklist
[Download PDF] (requires email)
```

**Add Mini Case Study (Social Proof):**
```
"ZeroMotion built our roofing site in 2 weeks. We're now #1 on Google for 'Houma roofing'."
— John Doe, ABC Roofing, Houma, LA
[Read Full Case Study →]
```

---

## 📞 CONTACT PAGE (`/contact`)

### Current State
**H1:** (Assumed) "Contact ZeroMotion"  
**Form Fields:** (Assumed) Name, Email, Phone, Message  
**CTA:** "Submit" or "Send Message"

### Issues (Assumed)
1. ❌ Generic contact form—no lead qualification
2. ❌ No incentive to submit (no lead magnet, no clear next step)
3. ❌ No social proof near form
4. ❌ No alternative CTAs (calendar booking, phone number, Slack community)

### Redline Recommendations

**Replace Generic Form with Qualified Lead Form:**

```
FIELDS (Progressive):
Step 1: Email (only)
Step 2 (auto-reveals): First name, Last name, Company, Phone

Step 3 (optional): 
- What are you looking for? [Dropdown: New Website | Marketing Automation | Paid Ads | Other]
- What's your timeline? [Dropdown: Urgent (< 2 weeks) | 1-2 months | Just exploring]
- Estimated monthly marketing budget? [Dropdown: <$1k | $1k-$3k | $3k-$10k | $10k+ | Not sure]
```

**Add Trust Elements:**
```
[Badge] ⭐⭐⭐⭐⭐ 4.9/5 on Google
[Badge] 🔒 Your info is 100% confidential. We hate spam too.
[Testimonial] "I submitted my info on Tuesday and had a proposal by Thursday. Super responsive!"
— Sarah P., Thibodaux, LA
```

**Add Alternative CTAs:**
```
Prefer to talk now? Call us: (985) 303-2016
Book a 15-min intro call: [Calendar Link]
```

---

## 🦶 FOOTER (Global)

### Current State
**Sections:** (Assumed) Logo | Nav Links | Social | Legal (Privacy, Terms, Cookies)  
**CTAs:** None visible

### Issues
1. ❌ No secondary CTA in footer (missed conversion opportunity)
2. ❌ No trust badges (BBB, Google Partner, GHL Certified, etc.)
3. ❌ No newsletter signup or community link

### Redline Recommendations

**Add Footer CTA Block:**
```html
<div class="footer-cta bg-gradient-to-r from-purple-900/30 to-black py-12 border-t border-white/10">
  <div class="container-page text-center">
    <h3 class="text-2xl font-bold mb-4">Ready to Scale Your Louisiana Business?</h3>
    <p class="text-white/70 mb-6">Get your custom quote in 2 minutes—no commitment required.</p>
    <button class="btn-primary" onclick="openLeadModal('footer')">Get My Quote</button>
  </div>
</div>
```

**Add Trust Badges:**
```
[Google Partner Badge] [GHL Certified Badge] [Louisiana Small Business Badge]
```

**Add Newsletter Signup:**
```
Join 200+ Louisiana business owners getting our weekly marketing tips.
[Email Input] [Subscribe Button]
```

---

## 🚨 404 ERROR PAGE

### Current State
(Assumed): Generic "Page Not Found" message

### Issues
1. ❌ No recovery CTA
2. ❌ Missed opportunity to capture lost traffic

### Redline Recommendations

**Redesign as Conversion Opportunity:**
```
404: This Page Took a Vacation to the Bayou 🌴

Looks like this page doesn't exist. But we can still help you grow your business.

[Primary CTA] Get My Custom Quote
[Secondary CTA] View Our Services
[Tertiary CTA] Return Home

or search our site: [Search Bar]
```

---

## 📊 SUMMARY OF PAGE PRIORITIES

| Page | Priority | Effort | Impact | Quick Wins |
|------|----------|--------|--------|------------|
| `/pricing` | 🔴 CRITICAL | High | Very High | Gate comparison table, soften price ranges |
| `/plans/*` | 🔴 CRITICAL | Medium | High | Add ROI calculator (gated), soften pricing |
| `/` (Homepage) | 🟠 HIGH | Medium | High | Add social proof, change CTA to "Get Quote" |
| `/contact` | 🟡 MEDIUM | Low | Medium | Upgrade to qualified lead form |
| Footer (Global) | 🟡 MEDIUM | Low | Medium | Add CTA block |
| Service Pages | 🟢 LOW | Low | Low-Medium | Add pricing tier context |
| 404 | 🟢 LOW | Very Low | Low | Add recovery CTAs |

---

**Next Document:** `03_COPY_SYSTEM.md` - Headlines, CTAs, Messaging Matrix

