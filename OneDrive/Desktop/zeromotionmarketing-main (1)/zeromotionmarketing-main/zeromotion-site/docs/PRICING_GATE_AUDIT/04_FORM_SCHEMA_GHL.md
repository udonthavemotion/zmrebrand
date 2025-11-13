# FORM SCHEMA & GHL IMPLEMENTATION
## ZeroMotion Marketing - Lead Capture System

**Audit Date:** October 25, 2025

---

## 📋 PRIMARY LEAD FORM SCHEMA

### Form Purpose: Custom Quote Request  
### Form ID: `pricing-gate-form-v1` (New GHL Form)

---

### STEP 1: Email Capture (Progressive)

| Field Name | Field Type | Validation | Placeholder | Required | Error Message |
|------------|-----------|------------|-------------|----------|---------------|
| `email` | Email | Email format + domain check | "you@yourcompany.com" | ✅ Yes | "Please enter a valid work email" |

**Validation Rules:**
- Reject free email domains: `gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com` (flag, don't block)
- Check for `@` and `.` format
- Trim whitespace
- Convert to lowercase

**On Submit:**
- Store email in localStorage (`zm_lead_email`)
- Auto-reveal Step 2 fields (no page reload)
- Fire GA4 event: `begin_checkout` (category: `lead_form`, label: `step_1_complete`)

---

### STEP 2: Contact Info (Auto-Reveals After Step 1)

| Field Name | Field Type | Validation | Placeholder | Required | Error Message |
|------------|-----------|------------|-------------|----------|---------------|
| `first_name` | Text | Min 2 chars, letters only | "John" | ✅ Yes | "First name required" |
| `last_name` | Text | Min 2 chars, letters only | "Doe" | ✅ Yes | "Last name required" |
| `company` | Text | Min 2 chars | "Your Company" | ✅ Yes | "Company name required" |
| `phone` | Phone | US format: (XXX) XXX-XXXX | "(985) 555-1234" | ❌ No | "Please enter valid phone" |

**Validation Rules:**
- `first_name`, `last_name`: Trim whitespace, capitalize first letter
- `phone`: Auto-format to (XXX) XXX-XXXX; accept 10-digit input
- `company`: No special validation (allow any input)

---

### STEP 3: Qualification (Auto-Reveals After Step 2)

| Field Name | Field Type | Options | Placeholder | Required | Scoring Weight |
|------------|-----------|---------|-------------|----------|----------------|
| `services_interested` | Dropdown (Multi-Select) | • New Website<br>• Marketing Automation<br>• Paid Ads (Google/Facebook)<br>• SEO & Local Rankings<br>• Brand & Design<br>• Other | "What are you looking for?" | ✅ Yes | +5 per selection |
| `timeline` | Dropdown (Single) | • Urgent (< 2 weeks)<br>• 1-2 months<br>• 3-6 months<br>• Just exploring | "What's your timeline?" | ✅ Yes | Urgent: +15<br>1-2mo: +10<br>3-6mo: +5<br>Exploring: +0 |
| `monthly_budget` | Dropdown (Single) | • Less than $1,000<br>• $1,000 - $3,000<br>• $3,000 - $10,000<br>• $10,000+<br>• Not sure yet | "Estimated monthly marketing budget?" | ❌ No | $10k+: +20<br>$3k-10k: +15<br>$1k-3k: +10<br><$1k: +5<br>Not sure: +3 |
| `how_heard` | Dropdown (Single) | • Google Search<br>• Facebook/Instagram<br>• Referral<br>• LinkedIn<br>• Drove by office<br>• Other | "How did you hear about us?" | ❌ No | N/A (for attribution) |

**Scoring Logic:**
- Total possible score: 75 points
- **Hot Lead (50+):** Urgent timeline + $10k+ budget + multiple services
- **Warm Lead (30-49):** 1-2 month timeline + $3k+ budget
- **Cold Lead (<30):** Exploring + low budget

---

### HIDDEN FIELDS (Auto-Populated)

| Field Name | Source | Purpose |
|------------|--------|---------|
| `utm_source` | URL parameter | Attribution (e.g., `google`, `facebook`) |
| `utm_medium` | URL parameter | Attribution (e.g., `cpc`, `social`) |
| `utm_campaign` | URL parameter | Campaign tracking |
| `utm_content` | URL parameter | Ad variant tracking |
| `utm_term` | URL parameter | Keyword tracking (Google Ads) |
| `gclid` | URL parameter | Google Ads click ID |
| `fbclid` | URL parameter | Facebook click ID |
| `msclkid` | URL parameter | Microsoft Ads click ID |
| `li_fat_id` | URL parameter | LinkedIn Insight Tag ID |
| `referrer` | `document.referrer` | Last page visited |
| `landing_page` | `window.location.href` | First page visited (session) |
| `device_type` | User-Agent | `mobile`, `tablet`, `desktop` |
| `browser` | User-Agent | Chrome, Safari, Edge, etc. |
| `form_location` | Manual tag | `homepage`, `pricing_page`, `modal`, etc. |
| `lead_score` | Calculated | Qualification score (0-75) |
| `timestamp` | `Date.now()` | Unix timestamp |
| `session_id` | GA4 or UUID | Unique session identifier |

---

### CONSENT & COMPLIANCE

| Field Name | Field Type | Label | Required | Storage |
|------------|-----------|--------|----------|---------|
| `consent_email` | Checkbox | "I agree to receive email updates from ZeroMotion. You can unsubscribe anytime." | ✅ Yes | GHL + localStorage |
| `consent_sms` | Checkbox | "I agree to receive SMS updates (optional)." | ❌ No | GHL + localStorage |
| `tcpa_consent` | Hidden (auto-checked) | "By submitting, I consent to ZeroMotion contacting me via email, phone, and SMS for marketing purposes. Msg & data rates may apply." | ✅ Yes (auto) | GHL |

**Compliance Notes:**
- TCPA compliance: Auto-consent via hidden field (user action = consent)
- CAN-SPAM compliance: Unsubscribe link in all emails
- GDPR/CCPA: Data retention policy linked near form ("Privacy Policy")
- Louisiana Business License: Display near form ("Licensed Louisiana Business #XXXXX")

---

### ERROR STATES & VALIDATION MESSAGES

| Error Scenario | Message | Display Style |
|----------------|---------|---------------|
| Empty required field | "This field is required" | Red border + red text below field |
| Invalid email format | "Please enter a valid email address" | Red border + red text below field |
| Free email domain | "⚠️ Using a work email helps us serve you better" | Yellow border + warning icon (don't block) |
| Invalid phone format | "Please enter a valid 10-digit phone number" | Red border + red text below field |
| No selection (dropdown) | "Please select an option" | Red border + red text below field |
| Missing consent | "Please agree to receive email updates to continue" | Red border around checkbox |
| Form submission error (network) | "Oops! Something went wrong. Please try again or call us at (985) 303-2016" | Modal overlay with retry button |

---

### SUCCESS STATE

**On Successful Submission:**
1. **Instant Acknowledgment (Modal):**
   ```
   ✅ Quote Request Received!
   
   Thanks, [First Name]! We're reviewing your info now.
   
   ➤ Check your email for your custom quote (arrives in 2-5 minutes)
   ➤ Want to talk now? Book a 15-min call: [Calendar Link]
   ➤ Or we'll reach out within 4 hours (usually faster)
   
   [Close] [Book a Call]
   ```

2. **Redirect Options:**
   - **Option A (Recommended):** Stay on page, show success modal (above)
   - **Option B:** Redirect to `/thank-you?source=pricing-gate` (see Thank You Page spec below)

3. **Fire Events:**
   - GA4: `generate_lead` (category: `conversion`, label: `pricing_gate`, value: [lead_score])
   - Facebook Pixel: `Lead` event
   - LinkedIn Insight: `Conversion` event
   - GHL Workflow: Trigger "New Lead - Pricing Gate" workflow (see GHL Blueprint section)

---

## 🔄 PROGRESSIVE PROFILING (Returning Visitors)

### Logic
- If localStorage contains `zm_lead_email`, pre-fill Step 1
- Show message: "Welcome back, [First Name]! Need a new quote?"
- Skip to Step 3 (Qualification) if returning within 30 days
- Update lead record in GHL (append new data, don't duplicate)

### Implementation
```javascript
// On page load
const storedEmail = localStorage.getItem('zm_lead_email');
const storedFirstName = localStorage.getItem('zm_first_name');

if (storedEmail) {
  document.getElementById('email').value = storedEmail;
  document.getElementById('first_name').value = storedFirstName || '';
  document.querySelector('.welcome-back-message').style.display = 'block';
  document.querySelector('.welcome-back-message').innerHTML = `
    Welcome back, ${storedFirstName || 'there'}! Need a new quote? Just update your details below.
  `;
}
```

---

## 📄 THANK YOU PAGE SPEC (`/thank-you`)

### URL Structure
`/thank-you?source=pricing-gate&plan=growth&email=[email]&score=[score]`

### Content

**H1:** "Your Custom Quote Is On the Way, [First Name]!"

**Subhead:** "Check your email in 2-5 minutes. Here's what happens next:"

**Timeline:**
```
✅ Now: Quote sent to [email]
⏰ Within 4 hours: Personal follow-up from our team
📅 Next 7 days: Helpful tips + case studies to help you decide
```

**CTAs:**
- Primary: "Book a 15-Min Strategy Call" (Calendar embed or link)
- Secondary: "Download Free Audit Checklist" (Lead magnet)
- Tertiary: "View Case Studies" (Link to /case-studies or testimonials section)

**Social Proof:**
```
Join 40+ Louisiana businesses who trust ZeroMotion:
⭐⭐⭐⭐⭐ 4.9/5 on Google
[Testimonial Carousel: 3-5 short quotes]
```

**GA4 Event:** Fire `view_thank_you` (category: `engagement`, label: `pricing_gate`)

---

## 🕷️ SPAM & DUPLICATE PREVENTION

### reCAPTCHA v3
- **Implementation:** Invisible reCAPTCHA (no checkbox)
- **Threshold:** Score < 0.5 = flag for manual review (don't block)
- **Fallback:** If reCAPTCHA fails to load, allow submission (don't break UX)

### Honeypot Field
- **Field Name:** `website_url` (hidden via CSS)
- **Logic:** If filled, reject submission silently (bot trap)
- **User-Facing:** No error message (bots won't see it anyway)

### Duplicate Detection
- **Logic:** Check GHL for existing lead with same `email` in last 30 days
- **If Duplicate:**
  - **Option A:** Update existing lead record (append new data)
  - **Option B:** Show message: "We already have your info! A strategist will reach out within 4 hours."
  - **Action:** Skip automation workflow (don't re-send welcome email)

### Rate Limiting
- **Rule:** Max 3 submissions per IP per 24 hours
- **If Exceeded:** Show message: "You've reached the maximum submissions. Please call us at (985) 303-2016 for immediate assistance."

---

## 🎨 FORM UI/UX BEST PRACTICES

### Mobile Optimization
- **Field Height:** Min 48px (Apple Human Interface Guidelines)
- **Font Size:** Min 16px (prevent iOS zoom)
- **Tap Targets:** Min 44x44px for buttons
- **Keyboard Handling:**
  - `type="email"` → shows email keyboard (@, .)
  - `type="tel"` → shows numeric keyboard
  - `autocomplete` attributes set (e.g., `autocomplete="email"`)

### Visual Progress Indicator
```
Step 1: Email → Step 2: Contact Info → Step 3: Almost Done!
[●○○] Progress bar (fills as user completes steps)
```

### Autosave (Optional, Advanced)
- Save form data to localStorage every 2 seconds
- If user closes modal, recover data on next open
- Show message: "We saved your progress. Pick up where you left off."

### Exit Intent Recovery
- **Trigger:** User moves mouse to close tab/window
- **Action:** Show modal: "Wait! Get your free 30-point audit before you go. Just enter your email."
- **Form:** Single-field email capture → Deliver lead magnet PDF

---

## 🧪 A/B TEST VARIANTS

### Variant A: Single-Step Form (Benchmark)
- All fields visible at once (8-10 fields)
- Hypothesis: Simpler for users who prefer to see everything upfront
- Expected Completion Rate: 15-20%

### Variant B: 2-Step Form (Recommended)
- Step 1: Email only
- Step 2: Auto-reveal remaining fields
- Hypothesis: Reduces cognitive load; increases start rate
- Expected Completion Rate: 28-35%

### Variant C: 3-Step Form (Progressive)
- Step 1: Email
- Step 2: Contact info (name, company, phone)
- Step 3: Qualification (services, timeline, budget)
- Hypothesis: Maximizes start rate; may have higher abandonment on Step 3
- Expected Completion Rate: 25-32%

### Tracking
- **Metric 1:** Form start rate (`begin_checkout` event)
- **Metric 2:** Step 2 abandonment rate
- **Metric 3:** Form completion rate (`generate_lead` event)
- **Metric 4:** Time to complete (avg. seconds)

---

**Next Document:** `05_GHL_AUTOMATION.md` - GoHighLevel Workflow Blueprints

