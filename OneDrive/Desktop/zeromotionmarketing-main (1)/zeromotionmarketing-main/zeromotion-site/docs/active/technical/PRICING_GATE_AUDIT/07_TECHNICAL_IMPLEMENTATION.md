# TECHNICAL IMPLEMENTATION GUIDE
## Cursor Agent Specifications - Pricing Gate System

**Audit Date:** October 25, 2025  
**Tech Stack:** Astro, TypeScript, TailwindCSS, GoHighLevel

---

## 📁 PROPOSED FILE STRUCTURE

```
zeromotion-site/
├── src/
│   ├── components/
│   │   ├── LeadModal.astro (✅ EXISTS - MODIFY)
│   │   ├── StrategistModal.astro (✅ EXISTS - KEEP AS IS)
│   │   ├── PricingGateModal.astro (🆕 NEW - Optional alternative to LeadModal)
│   │   ├── MultiStepForm.astro (🆕 NEW - 2-step form component)
│   │   ├── SocialProofStrip.astro (🆕 NEW - Logo grid + metrics)
│   │   ├── FAQAccordion.astro (🆕 NEW - Pricing FAQs)
│   │   ├── ExitIntentPopup.astro (🆕 NEW - Exit recovery)
│   │   ├── ROICalculator.astro (🆕 NEW - Interactive calculator)
│   │   └── pricing/
│   │       ├── PlanCard.astro (✅ EXISTS - MODIFY)
│   │       ├── ComparisonTable.astro (✅ EXISTS - GATE IT)
│   │       └── FAQBlock.astro (✅ EXISTS - UPDATE COPY)
│   │
│   ├── pages/
│   │   ├── pricing.astro (✅ EXISTS - MAJOR MODIFICATIONS)
│   │   ├── plans/
│   │   │   ├── starter.astro (✅ EXISTS - MODIFY)
│   │   │   ├── growth.astro (✅ EXISTS - MODIFY)
│   │   │   └── scale.astro (✅ EXISTS - MODIFY)
│   │   ├── thank-you.astro (🆕 NEW - Post-submit page)
│   │   └── api/
│   │       ├── lead.ts (✅ EXISTS - ENHANCE for Conversion API)
│   │       └── conversion-api.ts (🆕 NEW - Meta CAPI endpoint)
│   │
│   ├── lib/
│   │   ├── leadScore.ts (🆕 NEW - Qualification scoring logic)
│   │   ├── formValidation.ts (🆕 NEW - Validation helpers)
│   │   ├── tracking.ts (🆕 NEW - DataLayer helpers)
│   │   └── storage.ts (🆕 NEW - localStorage helpers for progressive profiling)
│   │
│   ├── data/
│   │   ├── packages.ts (✅ EXISTS - UPDATE pricing ranges)
│   │   ├── testimonials.ts (🆕 NEW - Social proof data)
│   │   └── faqs.ts (🆕 NEW - FAQ data)
│   │
│   └── styles/
│       └── form.css (🆕 NEW - Form-specific styles)
│
├── public/
│   └── lead-magnets/
│       └── 30-point-audit-checklist.pdf (🆕 NEW - Lead magnet)
│
└── docs/
    └── PRICING_GATE_AUDIT/ (✅ THIS DOCUMENT)
```

---

## 🧩 COMPONENT SPECIFICATIONS

### 1. MultiStepForm.astro (NEW)

**Purpose:** 2-step lead capture form (email → details → qualification)

**Props:**
```typescript
interface Props {
  formId: string; // GHL form ID
  planSelected?: string; // "starter" | "growth" | "scale"
  formLocation: string; // "pricing_page" | "homepage_modal"
  showProgressBar?: boolean; // default: true
}
```

**Structure:**
```astro
---
const { formId, planSelected = "", formLocation, showProgressBar = true } = Astro.props;
---

<form id="multi-step-form" class="multi-step-form" data-form-location={formLocation}>
  <!-- Progress Bar -->
  {showProgressBar && (
    <div class="progress-bar">
      <div class="progress-step active" data-step="1">1. Email</div>
      <div class="progress-step" data-step="2">2. Details</div>
      <div class="progress-step" data-step="3">3. Almost Done!</div>
    </div>
  )}

  <!-- Step 1: Email Only -->
  <div class="form-step" data-step="1" data-active="true">
    <h3>Get Your Custom Quote</h3>
    <p>Enter your work email to see pricing tailored to your business.</p>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="you@yourcompany.com"
      required
      autocomplete="email"
    />
    <button type="button" class="btn-primary" onclick="nextStep(2)">Continue</button>
  </div>

  <!-- Step 2: Contact Info (Hidden Initially) -->
  <div class="form-step" data-step="2" data-active="false" style="display:none;">
    <h3>Almost There, [First Name]!</h3>
    <input type="text" id="first_name" name="first_name" placeholder="John" required autocomplete="given-name" />
    <input type="text" id="last_name" name="last_name" placeholder="Doe" required autocomplete="family-name" />
    <input type="text" id="company" name="company" placeholder="Your Company" required autocomplete="organization" />
    <input type="tel" id="phone" name="phone" placeholder="(985) 555-1234" autocomplete="tel" />
    <button type="button" class="btn-primary" onclick="nextStep(3)">Continue</button>
  </div>

  <!-- Step 3: Qualification (Hidden Initially) -->
  <div class="form-step" data-step="3" data-active="false" style="display:none;">
    <h3>Last Question, [First Name]</h3>
    <label>What are you looking for? (Select all that apply)</label>
    <select id="services_interested" name="services_interested" multiple required>
      <option value="website">New Website</option>
      <option value="marketing_automation">Marketing Automation</option>
      <option value="paid_ads">Paid Ads</option>
      <option value="seo">SEO & Local Rankings</option>
      <option value="brand">Brand & Design</option>
    </select>

    <label>What's your timeline?</label>
    <select id="timeline" name="timeline" required>
      <option value="urgent">Urgent (< 2 weeks)</option>
      <option value="1-2mo">1-2 months</option>
      <option value="3-6mo">3-6 months</option>
      <option value="exploring">Just exploring</option>
    </select>

    <label>Estimated monthly marketing budget?</label>
    <select id="monthly_budget" name="monthly_budget">
      <option value="">Not sure yet</option>
      <option value="<1k">Less than $1,000</option>
      <option value="1k-3k">$1,000 - $3,000</option>
      <option value="3k-10k">$3,000 - $10,000</option>
      <option value="10k+">$10,000+</option>
    </select>

    <!-- Hidden Fields (UTM tracking) -->
    <input type="hidden" id="utm_source" name="utm_source" />
    <input type="hidden" id="utm_medium" name="utm_medium" />
    <input type="hidden" id="gclid" name="gclid" />
    <input type="hidden" id="lead_score" name="lead_score" />
    <input type="hidden" id="plan_selected" name="plan_selected" value={planSelected} />

    <!-- Consent -->
    <label class="checkbox-label">
      <input type="checkbox" id="consent_email" name="consent_email" required />
      I agree to receive email updates from ZeroMotion. Unsubscribe anytime.
    </label>

    <button type="submit" class="btn-primary">Get My Quote</button>
    <p class="form-disclaimer">🔒 Your info is 100% confidential. We hate spam too.</p>
  </div>
</form>

<script is:inline>
  // Multi-step form logic (see below)
</script>
```

**JavaScript Logic:**
```javascript
// Multi-step form progression
let currentStep = 1;

function nextStep(step) {
  // Validate current step
  const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
  
  let valid = true;
  inputs.forEach(input => {
    if (!input.value) {
      input.classList.add('error');
      valid = false;
    } else {
      input.classList.remove('error');
    }
  });

  if (!valid) return;

  // Hide current step
  currentStepEl.style.display = 'none';
  currentStepEl.setAttribute('data-active', 'false');

  // Show next step
  const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
  nextStepEl.style.display = 'block';
  nextStepEl.setAttribute('data-active', 'true');

  // Update progress bar
  document.querySelectorAll('.progress-step').forEach(el => {
    if (parseInt(el.getAttribute('data-step')) <= step) {
      el.classList.add('active');
    }
  });

  // Fire GA4 event
  if (step === 2) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'begin_checkout',
      form_location: document.getElementById('multi-step-form').getAttribute('data-form-location'),
      plan: document.getElementById('plan_selected').value
    });
  }

  currentStep = step;
}

// Form submission
document.getElementById('multi-step-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Calculate lead score
  const leadScore = calculateLeadScore(); // see leadScore.ts
  document.getElementById('lead_score').value = leadScore;

  // Submit to GHL
  const formData = new FormData(e.target);
  const response = await fetch('/api/lead', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    // Fire GA4 conversion
    window.dataLayer.push({
      event: 'generate_lead',
      value: 1500.00,
      lead_score: leadScore,
      plan: document.getElementById('plan_selected').value
    });

    // Show success modal or redirect
    window.location.href = '/thank-you?email=' + document.getElementById('email').value;
  } else {
    alert('Oops! Something went wrong. Please try again or call (985) 303-2016.');
  }
});
```

---

### 2. ROICalculator.astro (NEW)

**Purpose:** Interactive calculator to show projected ROI (gated behind email capture)

**Structure:**
```astro
<div class="roi-calculator">
  <h3>Calculate Your Marketing ROI</h3>
  <p>See what Growth Marketing could do for YOUR business.</p>

  <!-- Calculator Inputs -->
  <div class="calculator-inputs">
    <label>
      Current Monthly Ad Spend
      <input type="number" id="ad_spend" placeholder="2000" min="0" />
    </label>
    <label>
      Current Leads per Month
      <input type="number" id="current_leads" placeholder="10" min="0" />
    </label>
    <label>
      Avg. Customer Value
      <input type="number" id="customer_value" placeholder="500" min="0" />
    </label>
  </div>

  <!-- Gate: Email Capture -->
  <div class="email-gate">
    <p>Enter your email to see your custom ROI projection:</p>
    <input type="email" id="calc_email" placeholder="you@yourcompany.com" required />
    <button class="btn-primary" onclick="calculateROI()">See My ROI</button>
  </div>

  <!-- Results (Hidden Until Email Submitted) -->
  <div id="calculator-results" style="display:none;" class="calculator-results">
    <h4>Your Projected ROI with ZeroMotion Growth Plan:</h4>
    <div class="result-card">
      <div class="result-label">Projected Leads per Month:</div>
      <div class="result-value" id="projected_leads">--</div>
    </div>
    <div class="result-card">
      <div class="result-label">Projected Revenue Increase:</div>
      <div class="result-value" id="projected_revenue">--</div>
    </div>
    <div class="result-card">
      <div class="result-label">ROI:</div>
      <div class="result-value" id="roi_percentage">--</div>
    </div>
    <button class="btn-primary" onclick="openLeadModal('roi-calculator')">Get My Custom Quote</button>
  </div>
</div>

<script is:inline>
  function calculateROI() {
    const email = document.getElementById('calc_email').value;
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    // Capture email (send to GHL or store in localStorage)
    localStorage.setItem('zm_lead_email', email);
    
    // Fire GA4 event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'file_download', // Treating calculator as lead magnet
      file_name: 'ROI Calculator',
      source: 'pricing_page'
    });

    // Get inputs
    const adSpend = parseFloat(document.getElementById('ad_spend').value) || 2000;
    const currentLeads = parseFloat(document.getElementById('current_leads').value) || 10;
    const customerValue = parseFloat(document.getElementById('customer_value').value) || 500;

    // Calculate ROI (simplified formula)
    const projectedLeads = Math.round(currentLeads * 3); // 3x multiplier
    const projectedRevenue = projectedLeads * customerValue;
    const roiPercentage = Math.round(((projectedRevenue - adSpend) / adSpend) * 100);

    // Display results
    document.getElementById('projected_leads').textContent = projectedLeads + ' leads/mo';
    document.getElementById('projected_revenue').textContent = '$' + projectedRevenue.toLocaleString();
    document.getElementById('roi_percentage').textContent = roiPercentage + '%';

    document.getElementById('calculator-results').style.display = 'block';
    document.querySelector('.email-gate').style.display = 'none';
  }
</script>
```

---

### 3. SocialProofStrip.astro (NEW)

**Purpose:** Display trust signals (logos, metrics, reviews)

**Structure:**
```astro
<div class="social-proof-strip">
  <div class="container-page">
    <div class="grid md:grid-cols-3 gap-6 text-center">
      <div class="proof-card">
        <div class="proof-metric">3x</div>
        <div class="proof-label">Average ROI in 90 Days</div>
      </div>
      <div class="proof-card">
        <div class="proof-metric">&lt;24h</div>
        <div class="proof-label">Median Speed-to-Lead</div>
      </div>
      <div class="proof-card">
        <div class="proof-metric">40+</div>
        <div class="proof-label">Louisiana Businesses Trust Us</div>
      </div>
    </div>

    <!-- Logo Grid -->
    <div class="logo-grid mt-8">
      <p class="text-white/70 mb-4">Trusted by Louisiana's top businesses:</p>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4 opacity-60">
        <!-- ADD CLIENT LOGOS HERE -->
        <div class="logo-placeholder">[Logo 1]</div>
        <div class="logo-placeholder">[Logo 2]</div>
        <div class="logo-placeholder">[Logo 3]</div>
        <div class="logo-placeholder">[Logo 4]</div>
        <div class="logo-placeholder">[Logo 5]</div>
        <div class="logo-placeholder">[Logo 6]</div>
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="trust-badges mt-6 flex justify-center gap-4">
      <div class="badge">⭐⭐⭐⭐⭐ 4.9/5 on Google</div>
      <div class="badge">🔒 30-Day Satisfaction Guarantee</div>
      <div class="badge">📞 (985) 303-2016</div>
    </div>
  </div>
</div>
```

---

## 📝 MODIFIED FILES SPECIFICATIONS

### pricing.astro (MAJOR MODIFICATIONS)

**Changes:**
1. **Soften Price Ranges** in `pricingTiers` data
2. **Replace CTA hrefs** with modal triggers (`onclick="openLeadModal()"`)
3. **Gate Comparison Table** (move to post-submit or make it gated)
4. **Update FAQ** with lead capture CTAs
5. **Add SocialProofStrip** component

**Code Changes:**

```astro
---
// ... existing imports ...
import SocialProofStrip from "../components/SocialProofStrip.astro";
import ROICalculator from "../components/ROICalculator.astro";

// UPDATE: Soften pricing in pricingTiers
const pricingTiers = [
  {
    id: "starter",
    name: "Starter Website",
    priceRange: "Starting at $200", // BEFORE: "$200–$300 build + $75–$100/mo"
    // ...rest
  },
  {
    id: "growth",
    name: "Growth Marketing",
    priceRange: "Starting at $1,000", // BEFORE: "$1,000–$1,500 setup + $150–$300/mo"
    // ...rest
  },
  {
    id: "scale",
    name: "Scale & Dominate",
    priceRange: "Starting at $2,000/mo", // BEFORE: "$2,000–$5,000+/mo"
    // ...rest
  }
];
---

<BaseLayout {title} {description}>
  <!-- Hero Section: ADD SocialProofStrip -->
  <section id="pricing-hero">
    <!-- ... existing hero content ... -->
  </section>

  <!-- NEW: Social Proof Strip (After Hero) -->
  <SocialProofStrip />

  <!-- Pricing Cards Section -->
  <section id="plans">
    <div class="grid md:grid-cols-3 gap-8">
      {pricingTiers.map((tier) => (
        <PlanCard
          name={tier.name}
          priceRange={tier.priceRange}
          features={tier.features}
          ctaText="Get My Quote"
          ctaOnClick={`openLeadModal('${tier.id}-plan')`}  <!-- CHANGE: Use onclick instead of href -->
          popular={tier.popular}
        />
      ))}
    </div>
  </section>

  <!-- GATE THIS: Comparison Table (Option A: Remove, Option B: Gate) -->
  <!-- <ComparisonTable /> -->  <!-- REMOVE OR GATE -->

  <!-- NEW: ROI Calculator (Gated) -->
  <section class="section-padding">
    <ROICalculator />
  </section>

  <!-- FAQ Section: UPDATE COPY (See 03_COPY_SYSTEM.md) -->
  <FAQBlock />

</BaseLayout>
```

---

### /api/lead.ts (ENHANCE)

**Purpose:** Handle form submissions, send to GHL, fire Conversion APIs

**Enhancements:**
1. Send to GHL webhook
2. Fire Meta Conversion API
3. Fire Google Enhanced Conversions (via GTM)
4. Store lead in database (optional)

**Code:**
```typescript
import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const payload = {
      email: formData.get('email'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      services_interested: formData.getAll('services_interested'),
      timeline: formData.get('timeline'),
      monthly_budget: formData.get('monthly_budget'),
      lead_score: formData.get('lead_score'),
      plan_selected: formData.get('plan_selected'),
      utm_source: formData.get('utm_source'),
      utm_medium: formData.get('utm_medium'),
      gclid: formData.get('gclid'),
      fbclid: formData.get('fbclid')
    };

    // 1. Send to GHL
    const ghlResponse = await fetch(import.meta.env.PUBLIC_GHL_FORM_BASE + '/webhook/form/' + import.meta.env.PUBLIC_GHL_FORM_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!ghlResponse.ok) {
      throw new Error('GHL submission failed');
    }

    // 2. Send to Meta Conversion API
    await sendMetaConversionAPI(payload, request);

    // 3. Return success
    return new Response(JSON.stringify({ success: true, leadScore: payload.lead_score }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Submission failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function sendMetaConversionAPI(payload: any, request: Request) {
  const hashedEmail = crypto.createHash('sha256').update(payload.email.toLowerCase().trim()).digest('hex');
  const hashedPhone = payload.phone ? crypto.createHash('sha256').update(payload.phone.replace(/\D/g, '')).digest('hex') : undefined;

  await fetch(`https://graph.facebook.com/v17.0/${import.meta.env.FB_PIXEL_ID}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          em: [hashedEmail],
          ph: hashedPhone ? [hashedPhone] : undefined,
          client_ip_address: request.headers.get('x-forwarded-for'),
          client_user_agent: request.headers.get('user-agent'),
          fbc: payload.fbclid ? `fb.1.${Date.now()}.${payload.fbclid}` : undefined
        },
        custom_data: {
          value: 1500, // Avg deal size
          currency: 'USD',
          lead_score: payload.lead_score,
          plan: payload.plan_selected
        }
      }],
      access_token: import.meta.env.FB_CONVERSION_API_TOKEN
    })
  });
}
```

---

## 🚀 LAUNCH CHECKLIST

### Pre-Launch QA

- [ ] **Forms:**
  - [ ] Test email validation (reject free domains)
  - [ ] Test phone formatting (auto-format to (XXX) XXX-XXXX)
  - [ ] Test multi-step progression (steps 1 → 2 → 3)
  - [ ] Test form submission (POST to GHL)
  - [ ] Test error handling (network failure)
  - [ ] Test mobile keyboard (email keyboard on iOS/Android)

- [ ] **Tracking:**
  - [ ] GA4 `begin_checkout` fires on Step 1 complete
  - [ ] GA4 `generate_lead` fires on form submit
  - [ ] Facebook Pixel `Lead` event fires
  - [ ] LinkedIn Insight Tag fires
  - [ ] UTM parameters captured in hidden fields
  - [ ] DataLayer populated correctly

- [ ] **UX:**
  - [ ] Test on iPhone (Safari, Chrome)
  - [ ] Test on Android (Chrome, Samsung Internet)
  - [ ] Test on desktop (Chrome, Firefox, Safari, Edge)
  - [ ] Test exit intent popup (desktop only)
  - [ ] Test ROI calculator (email gate + results display)

- [ ] **Performance:**
  - [ ] Lighthouse score >90 (mobile & desktop)
  - [ ] LCP <2.5s (mobile)
  - [ ] CLS <0.1
  - [ ] TTI <3s

---

## 📞 SUPPORT & ROLLBACK

**If Issues Arise:**
1. **Rollback Plan:** Git revert to previous commit (tag: `pre-pricing-gate`)
2. **Hotfix Branch:** Create `hotfix/pricing-gate-fix` for rapid patches
3. **Contact:** Owner or Lead Dev for approval

**Monitoring (First 48 Hours):**
- Check GA4 real-time for `generate_lead` events (expect 2-3/day)
- Monitor GHL for form submissions
- Check Slack alerts for errors
- Review Sentry for client-side errors

---

## ✅ DEFINITION OF DONE

- [ ] All code changes committed to `feature/pricing-gate` branch
- [ ] PR created and reviewed by senior dev
- [ ] QA checklist 100% complete
- [ ] GA4 conversion tracking verified in GTM preview mode
- [ ] GHL workflow tested end-to-end (form → email → task created)
- [ ] Lighthouse score >90 (mobile + desktop)
- [ ] No linter errors or console warnings
- [ ] Documentation updated (this file + inline code comments)
- [ ] Deployed to staging and tested by owner
- [ ] Deployed to production (scheduled for low-traffic window)
- [ ] Post-launch monitoring for 48 hours

---

**End of Technical Implementation Guide**

**Related Documents:**
- `01_EXECUTIVE_SUMMARY.md`
- `02_PAGE_ANALYSIS.md`
- `03_COPY_SYSTEM.md`
- `04_FORM_SCHEMA_GHL.md`
- `05_GHL_AUTOMATION.md`
- `06_TRACKING_EXPERIMENTS.md`

