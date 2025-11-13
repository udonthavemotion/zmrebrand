# TRACKING PLAN & EXPERIMENT DESIGN
## ZeroMotion Marketing - Analytics & CRO Testing

**Audit Date:** October 25, 2025

---

## 📊 GA4 EVENT PLAN

### Custom Events (Pricing Gate Funnel)

| Event Name | Trigger | Parameters | Purpose |
|------------|---------|------------|---------|
| `view_pricing_gate` | User lands on `/pricing` | `page_type`, `source`, `device` | Track pricing page views |
| `pricing_gate_open` | Modal opens OR `/pricing` form visible | `gate_type` (hard/hybrid), `location`, `plan` | Track gate exposure |
| `begin_checkout` | User starts form (Step 1 complete) | `plan`, `form_location`, `device` | Measure form start rate |
| `checkout_progress` | User completes Step 2 or 3 | `step_number`, `plan`, `form_location` | Track step progression |
| `generate_lead` | Form submitted successfully | `plan`, `lead_score`, `value`, `source` | PRIMARY CONVERSION EVENT |
| `book_appointment` | Calendar appointment booked | `appointment_type`, `source`, `plan` | Track consultation bookings |
| `file_download` | Lead magnet PDF downloaded | `file_name`, `source` | Track lead magnet engagement |
| `video_play` | Video played (testimonials, demos) | `video_title`, `video_location` | Track video engagement |
| `scroll_depth` | User scrolls 25%, 50%, 75%, 90% | `page_type`, `depth_percent` | Measure content engagement |
| `session_engaged` | User active 10+ seconds | `page_type`, `device` | Filter out bounces |
| `cta_click` | Any CTA button clicked | `cta_text`, `cta_location`, `page_type` | Track CTA effectiveness |
| `exit_intent` | User triggers exit intent popup | `page_type`, `popup_offer` | Track exit recovery attempts |
| `form_error` | Form validation error | `error_type`, `field_name` | Identify UX friction |

---

### Event Parameter Definitions

| Parameter | Type | Values | Purpose |
|-----------|------|--------|---------|
| `page_type` | String | `homepage`, `pricing`, `service`, `plan_detail`, `thank_you` | Segment by page |
| `plan` | String | `starter`, `growth`, `scale`, `custom` | Track plan interest |
| `source` | String | `organic`, `paid`, `social`, `referral`, `direct` | Attribution |
| `device` | String | `mobile`, `tablet`, `desktop` | Device segmentation |
| `gate_type` | String | `hard`, `hybrid`, `soft` | A/B test variant |
| `location` | String | `pricing_hero`, `plan_card`, `footer`, `exit_popup` | CTA location |
| `lead_score` | Integer | `0-75` | Qualification score |
| `value` | Float | Estimated deal value (e.g., `1500.00`) | Revenue attribution |
| `form_location` | String | `pricing_page`, `homepage_modal`, `plan_detail` | Form context |
| `step_number` | Integer | `1`, `2`, `3` | Form step |
| `cta_text` | String | "Get My Quote", "Talk to Strategist" | Exact CTA copy |
| `error_type` | String | `invalid_email`, `missing_field`, `network_error` | Error categorization |

---

### GA4 Conversion Events (Mark in GA4 Admin)
1. ✅ `generate_lead` (PRIMARY)
2. ✅ `book_appointment` (SECONDARY)
3. ✅ `file_download` (MICRO)

---

## 🏷️ GOOGLE TAG MANAGER SETUP

### Container Structure

#### Tags

| Tag Name | Tag Type | Trigger | Purpose |
|----------|----------|---------|---------|
| **GA4 - Config** | GA4 Configuration | All Pages | Initialize GA4 tracking |
| **GA4 - Lead Event** | GA4 Event | Custom Event: `formSubmitSuccess` | Fire `generate_lead` event |
| **GA4 - Form Start** | GA4 Event | Custom Event: `formStep1Complete` | Fire `begin_checkout` event |
| **GA4 - Scroll Tracking** | GA4 Event | Scroll Depth (25%, 50%, 75%, 90%) | Fire `scroll_depth` event |
| **GA4 - Video Tracking** | GA4 Event | YouTube/HTML5 Video | Fire `video_play` event |
| **GA4 - CTA Clicks** | GA4 Event | Click - All Elements (class contains `btn-`) | Fire `cta_click` event |
| **Facebook - Lead Event** | Custom HTML | Custom Event: `formSubmitSuccess` | Fire FB Pixel `Lead` event |
| **LinkedIn - Conversion** | LinkedIn Insight | Custom Event: `formSubmitSuccess` | Fire LI conversion |
| **Google Ads - Conversion** | Google Ads Conversion | Custom Event: `formSubmitSuccess` | Fire Google Ads conversion |

---

#### Triggers

| Trigger Name | Trigger Type | Conditions | Fires On |
|--------------|--------------|------------|----------|
| **All Pages** | Page View | N/A | Every page load |
| **Pricing Page View** | Page View | Page Path = `/pricing` | `/pricing` loads |
| **Form Submit Success** | Custom Event | Event = `formSubmitSuccess` | GHL form POST success |
| **Form Step 1 Complete** | Custom Event | Event = `formStep1Complete` | Step 1 email entered |
| **Scroll Depth** | Scroll Depth | 25%, 50%, 75%, 90% | User scrolls |
| **CTA Click** | Click - All Elements | Click Classes contains `btn-` | Button clicked |
| **Exit Intent** | Element Visibility | Element = `#exit-intent-modal` | Exit popup shows |

---

#### Variables

| Variable Name | Variable Type | Configuration | Purpose |
|---------------|--------------|---------------|---------|
| **GA4 Measurement ID** | Constant | `G-XXXXXXXXXX` | GA4 property ID |
| **GTM Server URL** | Constant | (optional) `https://gtm-server.com` | Server-side GTM |
| **Lead Score** | Data Layer Variable | `leadScore` | Pass lead score to GA4 |
| **Plan Selected** | Data Layer Variable | `planSelected` | Track plan interest |
| **Form Location** | Data Layer Variable | `formLocation` | Track form context |
| **UTM Source** | URL Variable | Query Parameter = `utm_source` | Attribution |
| **UTM Medium** | URL Variable | Query Parameter = `utm_medium` | Attribution |
| **UTM Campaign** | URL Variable | Query Parameter = `utm_campaign` | Campaign tracking |
| **Page Type** | Custom JavaScript | `return getPageType();` | Page categorization |

---

### DataLayer Push Examples

#### Form Submission (Lead Capture)
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'formSubmitSuccess',
  leadScore: 45,
  planSelected: 'growth',
  formLocation: 'pricing_page',
  estimatedValue: 1500.00,
  email: '[EMAIL]', // for Conversion API (hashed)
  phone: '[PHONE]', // for Conversion API (hashed)
  firstName: '[FIRST_NAME]',
  lastName: '[LAST_NAME]'
});

// Also fire GA4 generate_lead event
window.dataLayer.push({
  event: 'generate_lead',
  value: 1500.00,
  currency: 'USD',
  plan: 'growth',
  lead_score: 45
});
```

#### Form Start (Step 1 Complete)
```javascript
window.dataLayer.push({
  event: 'formStep1Complete',
  formLocation: 'pricing_page',
  planSelected: 'growth'
});

window.dataLayer.push({
  event: 'begin_checkout',
  plan: 'growth',
  form_location: 'pricing_page'
});
```

#### CTA Click
```javascript
window.dataLayer.push({
  event: 'cta_click',
  cta_text: 'Get My Quote',
  cta_location: 'pricing_hero',
  page_type: 'pricing'
});
```

---

## 🌐 CONVERSION APIs (SERVER-SIDE TRACKING)

### Why Conversion APIs?
- **Privacy:** Bypass browser tracking blockers (ad blockers, ITP)
- **Accuracy:** Server-side events are more reliable than client-side
- **Matching:** Improved attribution with first-party data (email, phone)

---

### Meta (Facebook) Conversion API

#### Setup
1. **Generate Access Token:** Facebook Events Manager → Settings → Conversions API
2. **Install Conversion API Gateway:** Use Meta's official library or GHL integration
3. **Server Endpoint:** `/api/lead` (POST from GHL webhook)

#### Event Mapping

| Client Event | Server Event | Event Name | Parameters |
|--------------|--------------|------------|------------|
| Form Submit | GHL Webhook POST | `Lead` | `email`, `phone`, `first_name`, `last_name`, `value`, `currency`, `source_url`, `fbc` (Facebook Click ID), `fbp` (Facebook Browser ID) |
| Calendar Booking | GHL Webhook POST | `Schedule` | Same as above |
| Thank You Page View | Server-side pixel | `CompleteRegistration` | Same as above |

#### Server-Side Code (Pseudocode)
```javascript
// /api/lead endpoint (Astro/Vercel Edge Function)
import crypto from 'crypto';

export async function POST({ request }) {
  const payload = await request.json();

  // Hash PII (REQUIRED by Meta)
  const hashedEmail = crypto.createHash('sha256').update(payload.email).digest('hex');
  const hashedPhone = crypto.createHash('sha256').update(payload.phone).digest('hex');

  // Send to Meta Conversion API
  const response = await fetch('https://graph.facebook.com/v17.0/[PIXEL_ID]/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: [{
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          em: [hashedEmail],
          ph: [hashedPhone],
          fn: [crypto.createHash('sha256').update(payload.first_name).digest('hex')],
          ln: [crypto.createHash('sha256').update(payload.last_name).digest('hex')],
          client_ip_address: request.headers.get('x-forwarded-for'),
          client_user_agent: request.headers.get('user-agent'),
          fbc: payload.fbclid ? `fb.1.${Date.now()}.${payload.fbclid}` : undefined,
          fbp: payload._fbp // from cookie
        },
        custom_data: {
          value: payload.estimatedValue || 1500,
          currency: 'USD',
          lead_score: payload.leadScore,
          plan: payload.planSelected
        },
        event_source_url: payload.sourceUrl
      }],
      access_token: process.env.FB_CONVERSION_API_TOKEN
    })
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
```

---

### Google Enhanced Conversions

#### Setup
1. **Enable in Google Ads:** Tools → Conversions → Settings → Enhanced Conversions
2. **Add to GTM Tag:** Use "Enhanced Conversions" variable in Google Ads Conversion tag
3. **Pass First-Party Data:** Email, phone, address (hashed automatically by GTM)

#### Event Mapping
| Event | Conversion Action | Value | Enhanced Data |
|-------|------------------|-------|---------------|
| Form Submit | `Pricing Gate Lead` | `$1500` (avg deal size) | `email`, `phone`, `first_name`, `last_name`, `address` |
| Calendar Booking | `Consultation Booked` | `$2000` (higher intent) | Same as above |

---

### LinkedIn Insight Tag

#### Setup
1. **Install Base Code:** Add to `<head>` of all pages
2. **Fire Conversion Event:** On form submit, call `window.lintrk('track', { conversion_id: XXXXX });`

#### Event Mapping
| Event | Conversion ID | Purpose |
|-------|--------------|---------|
| Form Submit | `[CONVERSION_ID_1]` | Track leads |
| Calendar Booking | `[CONVERSION_ID_2]` | Track high-intent |

---

## 📐 UTM TRACKING & ATTRIBUTION

### UTM Parameter Standards

| Parameter | Required? | Format | Example |
|-----------|----------|--------|---------|
| `utm_source` | ✅ Yes | Lowercase, no spaces | `google`, `facebook`, `linkedin`, `email` |
| `utm_medium` | ✅ Yes | Lowercase, no spaces | `cpc`, `social`, `email`, `referral` |
| `utm_campaign` | ✅ Yes | Lowercase, hyphens | `pricing-gate-launch`, `growth-plan-promo` |
| `utm_content` | ❌ Optional | Lowercase, hyphens | `hero-cta`, `sidebar-banner` |
| `utm_term` | ❌ Optional | Lowercase, hyphens (Google Ads auto-tags) | `digital-marketing-houma` |

### Example URLs

**Google Ads:**
```
https://zeromotion.marketing/pricing?utm_source=google&utm_medium=cpc&utm_campaign=pricing-gate-launch&utm_content=headline-a&gclid=ABC123
```

**Facebook Ads:**
```
https://zeromotion.marketing/pricing?utm_source=facebook&utm_medium=social&utm_campaign=growth-plan-promo&utm_content=carousel-ad&fbclid=XYZ789
```

**Email Newsletter:**
```
https://zeromotion.marketing/pricing?utm_source=email&utm_medium=newsletter&utm_campaign=weekly-tips-oct&utm_content=cta-button
```

---

### Hidden Fields in GHL Form
- Capture UTMs and store in GHL custom fields
- Use JavaScript to read URL parameters and pre-fill hidden fields

```javascript
// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Pre-fill hidden fields in GHL form
document.getElementById('utm_source').value = urlParams.get('utm_source') || 'direct';
document.getElementById('utm_medium').value = urlParams.get('utm_medium') || 'none';
document.getElementById('utm_campaign').value = urlParams.get('utm_campaign') || '';
document.getElementById('gclid').value = urlParams.get('gclid') || '';
document.getElementById('fbclid').value = urlParams.get('fbclid') || '';
```

---

## 🧪 EXPERIMENT PLAN (6 Prioritized Tests)

### Test 1: Hard Gate vs Hybrid Gate
**Hypothesis:** Hybrid gate (showing ranges) will reduce bounce rate by 20% and increase form starts by 30% compared to hard gate (no pricing visible).

| Variant | Description | Expected Outcome |
|---------|-------------|------------------|
| **Control (A)** | Hybrid gate: Show price ranges ($200-300, $1k-1.5k, $2k-5k) on `/pricing`, gate detailed breakdown | Bounce rate: 55%, Form start rate: 12% |
| **Variant B** | Hard gate: No pricing visible; "Get Custom Quote" required to see any pricing | Bounce rate: 70% (+15%), Form start rate: 8% (-4%) |

**Metrics:**
- Primary: Form start rate (`begin_checkout` / `view_pricing_gate`)
- Secondary: Bounce rate, time on page, form completion rate
- Guardrail: Total leads (must not decrease >10%)

**Sample Size:** 2,000 visitors (1,000 per variant)  
**Duration:** 2 weeks  
**Tool:** Google Optimize or Vercel Edge Config (A/B split)

**Success Criteria:** Variant with highest form completion rate (not just starts) wins.

---

### Test 2: 2-Step vs Single-Step Form
**Hypothesis:** 2-step form (email first, then details) will increase form completion by 25% vs single-step (all fields at once).

| Variant | Description | Expected Outcome |
|---------|-------------|------------------|
| **Control (A)** | Single-step: All 10 fields visible at once | Completion rate: 20% |
| **Variant B** | 2-step: Email only → auto-reveal remaining fields | Completion rate: 28% (+40% relative) |

**Metrics:**
- Primary: Form completion rate (`generate_lead` / `begin_checkout`)
- Secondary: Time to complete, field-level abandonment
- Guardrail: Lead quality (score must be ≥30)

**Sample Size:** 1,000 form starts (500 per variant)  
**Duration:** 1-2 weeks (depends on traffic)  
**Tool:** Custom implementation in LeadModal component

---

### Test 3: Social Proof Density
**Hypothesis:** High-density social proof (logos + metrics + testimonials) will increase form starts by 15% vs minimal social proof.

| Variant | Description | Expected Outcome |
|---------|-------------|------------------|
| **Control (A)** | Minimal: 1 testimonial + "40+ Louisiana businesses trust us" text | Form start rate: 12% |
| **Variant B** | High-density: 6 client logos + 3 testimonials + metrics (3x ROI, 4.9/5 stars) | Form start rate: 14% (+17% relative) |

**Metrics:**
- Primary: Form start rate
- Secondary: Scroll depth, time on page
- Guardrail: Bounce rate (must not increase >5%)

**Sample Size:** 2,000 visitors  
**Duration:** 2 weeks  
**Tool:** Google Optimize or server-side A/B test

---

### Test 4: CTA Phrasing
**Hypothesis:** Action-oriented CTA ("Get My Quote") will outperform passive CTA ("See Pricing") by 20%.

| Variant | Description | Expected Outcome |
|---------|-------------|------------------|
| **Control (A)** | "Get My Quote" | Click rate: 15% |
| **Variant B** | "Unlock My Pricing" | Click rate: 16% (+7% relative) |
| **Variant C** | "See Pricing & ROI" | Click rate: 17% (+13% relative) |

**Metrics:**
- Primary: CTA click rate (`cta_click` / page views)
- Secondary: Form start rate, form completion rate

**Sample Size:** 3,000 visitors (1,000 per variant)  
**Duration:** 2 weeks  
**Tool:** Google Optimize

---

### Test 5: Calendar-First vs Form-First
**Hypothesis:** Offering calendar booking as primary CTA will increase consultation bookings by 30% but may reduce total leads.

| Variant | Description | Expected Outcome |
|---------|-------------|------------------|
| **Control (A)** | Form-first: Primary CTA = "Get My Quote" (form modal) | Leads: 100, Bookings: 20 |
| **Variant B** | Calendar-first: Primary CTA = "Book Strategy Call" (calendar modal) | Leads: 70 (-30%), Bookings: 28 (+40%) |

**Metrics:**
- Primary: Consultation booking rate
- Secondary: Total leads, lead quality (score ≥40)
- Guardrail: Total conversions (leads + bookings) must stay flat or increase

**Sample Size:** 2,000 visitors  
**Duration:** 3 weeks  
**Tool:** Custom implementation (swap CTA order)

---

### Test 6: Hero Layout - Video vs Static Image
**Hypothesis:** Hero video (with motion) will increase engagement (scroll depth, time on page) by 20% vs static image, but may increase bounce on slow connections.

| Variant | Description | Expected Outcome |
|---------|-------------|------------------|
| **Control (A)** | Video hero (current implementation) | Scroll depth: 65%, Time on page: 2:15 |
| **Variant B** | Static image hero (high-quality photo) | Scroll depth: 60% (-5%), Time on page: 2:30 (+15s) |

**Metrics:**
- Primary: Scroll depth (% reaching 50%)
- Secondary: Time on page, bounce rate, form starts
- Guardrail: Mobile performance (LCP <2.5s)

**Sample Size:** 3,000 visitors  
**Duration:** 2 weeks  
**Tool:** Google Optimize

---

## 📅 EXPERIMENT CALENDAR (8-Week Plan)

| Week | Test Running | Sample Size Goal | Decision Date | Next Action |
|------|-------------|------------------|---------------|-------------|
| **1** | Test 1 (Hard vs Hybrid) | 1,000/2,000 | End of Week 2 | Declare winner, implement site-wide |
| **2** | Test 1 (continued) | 2,000/2,000 | End of Week 2 | Analyze + implement |
| **3** | Test 2 (2-Step vs Single) | 500/1,000 | Mid Week 4 | Declare winner |
| **4** | Test 2 (continued) + Test 3 (Social Proof) kickoff | 1,000/1,000 (T2), 500/2,000 (T3) | End of Week 4 (T2), End of Week 5 (T3) | Implement T2 winner |
| **5** | Test 3 (continued) | 2,000/2,000 | End of Week 5 | Implement T3 winner |
| **6** | Test 4 (CTA Phrasing) | 1,500/3,000 | Mid Week 7 | Declare winner |
| **7** | Test 4 (continued) + Test 5 (Calendar-First) kickoff | 3,000/3,000 (T4), 1,000/2,000 (T5) | End of Week 7 (T4), End of Week 8 (T5) | Implement T4 winner |
| **8** | Test 5 (continued) + Test 6 (Hero Video) kickoff | 2,000/2,000 (T5), 1,500/3,000 (T6) | End of Week 8 (T5), End of Week 9 (T6) | Implement T5 winner, continue T6 |

**Stopping Rules:**
- **Statistical Significance:** p < 0.05 (95% confidence)
- **Minimum Sample Size:** 500 conversions per variant (for form tests)
- **Early Stop (Negative):** If variant decreases conversions by >20% at 50% sample, stop test and declare control winner

---

**Next Document:** `07_TECHNICAL_SPECS.md` - Cursor Agent Implementation Guide

