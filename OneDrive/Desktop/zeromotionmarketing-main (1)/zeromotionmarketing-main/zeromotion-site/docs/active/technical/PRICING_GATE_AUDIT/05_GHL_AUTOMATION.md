# GOHIGHLEVEL AUTOMATION BLUEPRINT
## ZeroMotion - AI-Powered Automation Platform

**Audit Date:** October 25, 2025

---

## 🏗️ GHL PIPELINE STRUCTURE

### Pipeline Name: "Pricing Gate Leads"

| Stage | Purpose | SLA | Auto-Actions | Manual Actions |
|-------|---------|-----|--------------|----------------|
| **1. New Lead** | Initial submission | <1 min | • Send welcome email<br>• Send quote email<br>• Assign owner<br>• Calculate lead score<br>• Fire Slack alert | • Review submission<br>• Add notes |
| **2. Quote Sent** | Waiting for reply | <4 hours | • Schedule follow-up task<br>• Start SMS sequence | • Call if hot lead (score 50+)<br>• Email if warm (30-49) |
| **3. Engaged** | Responded/opened email | <24 hours | • Notify owner<br>• Update engagement score | • Book consultation call<br>• Send calendar link |
| **4. Consultation Booked** | Call scheduled | Pre-call prep | • Send calendar reminder<br>• Send prep email | • Prepare custom proposal<br>• Research business |
| **5. Proposal Sent** | Awaiting decision | <48 hours | • Schedule follow-up task<br>• Send proposal email | • Follow up via phone<br>• Answer questions |
| **6. Won** | Deal closed | Post-sale onboarding | • Send onboarding email<br>• Create project in PM tool<br>• Notify team | • Kick off project<br>• Send welcome packet |
| **7. Lost** | Not interested | N/A | • Tag reason<br>• Add to nurture list | • Document why lost<br>• Set 90-day follow-up |
| **8. Nurture** | Long-term follow-up | Quarterly check-in | • Quarterly email<br>• Biannual SMS | • Personalized outreach<br>• Share case studies |

---

## 🤖 WORKFLOW 1: NEW LEAD - INSTANT RESPONSE

### Trigger
**Event:** Form submission to GHL (form ID: `pricing-gate-form-v1`)

### Conditions
- Lead status = "New"
- Email is not duplicate (or update existing lead if duplicate)

### Actions

#### Action 1: Send Welcome Email (Instant)
**Delay:** 0 minutes  
**From:** [Strategist Name] <[email]@zeromotion.marketing>  
**Subject:** "Your ZeroMotion Quote Is Ready ✅"  
**Template:** (See `03_COPY_SYSTEM.md` - Email 1)

**Personalization Tokens:**
- `{{contact.first_name}}`
- `{{contact.company}}`
- `{{custom_field.recommended_plan}}` (e.g., "Automation Pro")
- `{{custom_field.estimated_cost}}` (e.g., "$1,200 setup + $200/month")
- `{{custom_field.projected_roi}}` (calculated based on budget/industry)
- `{{custom_field.calendar_link}}` (unique per owner)

#### Action 2: Calculate Lead Score
**Logic:**
```javascript
// Scoring formula
let score = 0;

// Services interested (multi-select)
if (services_interested.includes('AI Voice Agents')) score += 10;
if (services_interested.includes('ZeroMotion Automations')) score += 10;
if (services_interested.includes('Missed Call Text-Back')) score += 8;
if (services_interested.includes('ZeroMotion CRM')) score += 8;
if (services_interested.includes('Paid Ads')) score += 5;
// ... +5 per service

// Timeline
if (timeline === 'Urgent (< 2 weeks)') score += 15;
if (timeline === '1-2 months') score += 10;
if (timeline === '3-6 months') score += 5;
if (timeline === 'Just exploring') score += 0;

// Budget
if (monthly_budget === '$10,000+') score += 20;
if (monthly_budget === '$3,000 - $10,000') score += 15;
if (monthly_budget === '$1,000 - $3,000') score += 10;
if (monthly_budget === 'Less than $1,000') score += 5;
if (monthly_budget === 'Not sure yet') score += 3;

// Email domain (work email bonus)
if (!['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(email_domain)) {
  score += 5;
}

return score; // 0-75
```

**Update Custom Field:** `contact.lead_score` = calculated score

#### Action 3: Assign Owner (Round Robin)
**Logic:**
- **Hot Leads (50+):** Assign to senior strategist (e.g., Owner or Lead Gen Specialist)
- **Warm Leads (30-49):** Round robin among team
- **Cold Leads (<30):** Assign to junior team member or automated nurture

**Owner Assignment Rules:**
- Owner 1 (Senior): Louisiana businesses, $10k+ budget, Urgent timeline
- Owner 2 (Mid): $3k-10k budget, 1-2 month timeline
- Owner 3 (Junior): <$3k budget, Exploring timeline

#### Action 4: Create Task for Owner
**Task:** "📞 Call [First Name] at [Company] - Lead Score: [score]"  
**Due Date:** 
- Hot leads: Within 1 hour
- Warm leads: Within 4 hours
- Cold leads: Within 24 hours

**Task Description:**
```
Lead Details:
• Name: [First Name] [Last Name]
• Company: [Company]
• Phone: [Phone]
• Email: [Email]
• Services: [Services Interested]
• Timeline: [Timeline]
• Budget: [Monthly Budget]
• Lead Score: [Score]

Next Steps:
1. Review quote email sent to lead
2. Call to introduce yourself and answer questions
3. Book consultation if qualified
4. Update pipeline stage after call
```

#### Action 5: Fire Slack/Teams Alert (Hot Leads Only)
**Condition:** Lead score >= 50

**Slack Message:**
```
🔥 Hot Lead Alert!

**[First Name] [Last Name]** at **[Company]** just requested a quote.

📊 Lead Score: **[Score]/75**
💰 Budget: **[Monthly Budget]**
⏰ Timeline: **[Timeline]**
🎯 Services: **[Services Interested]**

👉 Assigned to: **[Owner Name]**
📞 Phone: **[Phone]**
📧 Email: **[Email]**

[View in GHL →](link to contact)
```

#### Action 6: Update Pipeline Stage
**Move to:** "Quote Sent"

---

## 🤖 WORKFLOW 2: 5-TOUCH EMAIL NURTURE

### Trigger
**Event:** Contact enters "Quote Sent" stage

### Conditions
- Contact has not responded/engaged
- Contact has not booked a consultation

### Actions

#### Email 2: Case Study (24 hours after Email 1)
**Delay:** 24 hours  
**Template:** (See `03_COPY_SYSTEM.md` - Email 2)  
**Goal:** Social proof + demonstrate results  
**CTA:** "Book a 15-min demo"

#### Email 3: Objection Killer (48 hours after Email 1)
**Delay:** 48 hours (72 hours total from form submit)  
**Template:** (See `03_COPY_SYSTEM.md` - Email 3)  
**Goal:** Address common objections  
**CTA:** "Reply with questions" or "Book a call"

#### Email 4: Social Proof Bomb (5 days after Email 1)
**Delay:** 5 days  
**Template:** (See `03_COPY_SYSTEM.md` - Email 4)  
**Goal:** Build trust with testimonials  
**CTA:** "Read more reviews" or "Get started"

#### Email 5: Final Offer (7 days after Email 1)
**Delay:** 7 days  
**Template:** (See `03_COPY_SYSTEM.md` - Email 5)  
**Goal:** Create urgency, last-touch effort  
**CTA:** "Book a call before [Date]"

### Exit Conditions
- If contact replies → Move to "Engaged" stage, stop workflow
- If contact books call → Move to "Consultation Booked", stop workflow
- If contact opens email 3+ times → Tag as "Highly Engaged", alert owner

---

## 🤖 WORKFLOW 3: SMS FOLLOW-UP SEQUENCE

### Trigger
**Event:** Contact enters "Quote Sent" stage  
**Condition:** `consent_sms` = true (user opted in)

### Actions

#### SMS 1: Personal Intro (24 hours after form submit)
**Delay:** 24 hours  
**Template:** (See `03_COPY_SYSTEM.md` - SMS 1)  
**From:** [Owner Phone Number] or GHL SMS number

#### SMS 2: Gentle Reminder (48 hours after Email 3)
**Delay:** 48 hours after Email 3 (5 days total from form submit)  
**Template:** (See `03_COPY_SYSTEM.md` - SMS 2)

#### SMS 3: Final Reminder (6 days after Email 5)
**Delay:** 6 days after Email 5 (13 days total from form submit)  
**Template:** (See `03_COPY_SYSTEM.md` - SMS 3)

### Exit Conditions
- If contact replies → Alert owner, move to "Engaged"
- If contact requests STOP → Unsubscribe from SMS, continue email only

---

## 🤖 WORKFLOW 4: ENGAGEMENT DETECTION

### Trigger
**Event:** Email opened or link clicked

### Conditions
- Email from "Pricing Gate Leads" pipeline
- Contact in "Quote Sent" or "Engaged" stage

### Actions

#### Action 1: Update Engagement Score
**Logic:**
```javascript
let engagement_score = contact.engagement_score || 0;

// Email opened
if (email_opened) engagement_score += 2;

// Link clicked
if (link_clicked && link_url.includes('calendar')) engagement_score += 10; // High intent
if (link_clicked && link_url.includes('case-study')) engagement_score += 5;
if (link_clicked && link_url.includes('pricing')) engagement_score += 8;

// Multiple opens (re-engagement)
if (email_open_count >= 3) engagement_score += 5;

contact.engagement_score = engagement_score;
```

#### Action 2: Alert Owner (High Engagement)
**Condition:** Engagement score >= 15

**Alert:** (Email + Slack)
```
🎯 [First Name] at [Company] is highly engaged!

They've opened your email 3+ times and clicked:
• [Link 1]
• [Link 2]

➤ Call them NOW: [Phone]
➤ Or send a personal follow-up email

[View in GHL →](link)
```

#### Action 3: Move to "Engaged" Stage
**Condition:** Engagement score >= 10  
**Action:** Update pipeline stage to "Engaged"

---

## 🤖 WORKFLOW 5: CONSULTATION BOOKED

### Trigger
**Event:** Calendar appointment booked (GHL Calendar ID: `fr87zeXsZz80Eg05tQEV`)

### Actions

#### Action 1: Send Calendar Confirmation
**Delay:** 0 minutes (instant)  
**Template:** Calendar confirmation email (built into GHL Calendar)

#### Action 2: Send Pre-Call Prep Email
**Delay:** 24 hours before appointment  
**Subject:** "Preparing for Our Call Tomorrow"  
**Body:**
```
Hi [First Name],

Looking forward to our call tomorrow at [Appointment Time]!

To make the most of our 15 minutes, here's what to have ready:
✅ Your current website (if you have one)
✅ Any ad campaigns you're running
✅ Your rough monthly marketing budget
✅ Your top 2-3 business goals for 2025

I'll share:
✅ Custom pricing breakdown for [Company]
✅ Projected ROI and timeline
✅ Next steps if we're a good fit

Questions before our call? Reply to this email or text me: [Owner Phone]

Talk soon,
[Owner Name]
```

#### Action 3: Create Pre-Call Task for Owner
**Task:** "🎯 Prep for consultation: [First Name] at [Company]"  
**Due Date:** 1 hour before appointment  
**Description:**
```
Pre-Call Research:
• Review lead form submission: [Link to contact]
• Google their business: [Company Website]
• Check their GBP: google.com/maps/search/[Company]
• Review competitors in their area
• Prepare custom quote (use pricing calculator)

Call Agenda:
1. Intro + rapport (2 min)
2. Understand their goals + challenges (5 min)
3. Present recommended plan + pricing (5 min)
4. Answer questions (2 min)
5. Next steps (1 min)
```

#### Action 4: Send Appointment Reminder (SMS)
**Delay:** 2 hours before appointment  
**Template:**
```
Hi [First Name], friendly reminder: We're talking in 2 hours! Check your email for the call link. See you soon! - [Owner Name]
```

#### Action 5: Update Pipeline Stage
**Move to:** "Consultation Booked"

---

## 🤖 WORKFLOW 6: DEAL WON - ONBOARDING

### Trigger
**Event:** Deal moved to "Won" stage

### Actions

#### Action 1: Send Welcome Email
**Delay:** 0 minutes  
**Subject:** "Welcome to ZeroMotion! Here's What Happens Next 🚀"  
**Body:**
```
Hi [First Name],

Welcome to the ZeroMotion family! We're pumped to work with [Company].

Here's what happens next:

📅 Week 1: Onboarding + Discovery
• Kickoff call (scheduled for [Date])
• Access to our client portal
• Brand assets + content collection

📅 Week 2-3: Build Phase
• [Service 1] setup begins
• [Service 2] development
• Weekly check-in calls

📅 Week 4: Launch
• Final review + QA
• Go-live!
• Training session

You'll receive:
✅ Access to your client portal (link below)
✅ Calendar invite for kickoff call
✅ Welcome packet PDF (attached)

Questions? Reply anytime or text me: [Owner Phone]

Let's do this,
[Owner Name]
ZeroMotion

[Access Client Portal →]
```

#### Action 2: Create Project in Project Management Tool
**Integration:** Zapier/Make → Asana/ClickUp/Monday  
**Data:**
- Project Name: "[Company] - [Plan Name]"
- Client: [First Name] [Last Name]
- Start Date: [Today]
- Due Date: [Based on plan - e.g., 4 weeks]
- Assigned To: [Owner + Delivery Team]

#### Action 3: Notify Team (Slack)
**Channel:** #new-clients  
**Message:**
```
🎉 New Client Onboarded!

**[Company]** signed up for **[Plan Name]** ($[MRR]/mo)

👤 Contact: [First Name] [Last Name]
📧 Email: [Email]
📞 Phone: [Phone]
🎯 Services: [Services List]
🗓️ Start Date: [Today]
🏁 Go-Live Target: [4 weeks from today]

➤ Project created in [PM Tool]: [Link]
➤ Client portal: [Link]

Team: Let's deliver an amazing experience! 🚀
```

#### Action 4: Add to Monthly Reporting
**Integration:** Google Sheets or GHL Reporting  
**Update:** Add new client to "Monthly Clients" sheet with MRR, services, start date

---

## 🤖 WORKFLOW 7: DEAL LOST - NURTURE

### Trigger
**Event:** Deal moved to "Lost" stage

### Actions

#### Action 1: Tag Reason Lost
**Prompt Owner:** "Why was this deal lost?"  
**Options:**
- Price too high
- Went with competitor
- Not ready yet (timing)
- Bad fit (services don't match)
- No budget
- Ghosted/No response
- Other

**Tag Contact:** `lost_reason_[option]`

#### Action 2: Send "Stay in Touch" Email
**Delay:** 0 minutes  
**Subject:** "Thanks for Considering ZeroMotion"  
**Body:**
```
Hi [First Name],

I know you decided not to move forward with ZeroMotion right now—no worries!

If anything changes or you have questions down the road, I'm here.

In the meantime, I'll send you our monthly newsletter with Louisiana automation insights and AI updates (free, no spam). Want to stay on the list?

[Yes, Keep Me Subscribed] [No, Unsubscribe]

Thanks for your time,
[Owner Name]
```

#### Action 3: Schedule 90-Day Follow-Up Task
**Task:** "🔄 Re-engage [First Name] at [Company]"  
**Due Date:** 90 days from today  
**Description:**
```
This lead went cold 90 days ago.

Reason: [Lost Reason]

Action:
• Send personalized email (new case study, updated pricing, etc.)
• Check if their situation has changed
• Offer free consultation
```

#### Action 4: Move to "Nurture" Stage
**Pipeline Stage:** "Nurture"

---

## 📊 GHL REPORTING DASHBOARD

### KPIs to Track (Weekly Review)

| Metric | Goal | Formula | Source |
|--------|------|---------|--------|
| **New Leads** | 70-100/mo | Count of form submissions | GHL Forms |
| **Form Completion Rate** | 28-35% | (Submissions / Form Starts) × 100 | GA4 Events |
| **Lead Score Avg.** | 35+ | Avg. of `lead_score` field | GHL Custom Field |
| **Speed-to-Lead (Median)** | <4 hours | Time from submit to first owner contact | GHL Tasks |
| **Email Open Rate** | 40-50% | (Opens / Sent) × 100 | GHL Email Stats |
| **SMS Reply Rate** | 15-25% | (Replies / Sent) × 100 | GHL SMS Stats |
| **Consultation Booking Rate** | 20-30% | (Booked / Leads) × 100 | GHL Calendar |
| **Lead-to-MQL Rate** | 25%+ | (MQLs / Leads) × 100 | Pipeline "Engaged" stage |
| **Close Rate** | 15-25% | (Won / Engaged) × 100 | Pipeline "Won" stage |
| **Avg. Deal Size** | $1,500+ | Avg. MRR × 12 | GHL Opportunities |
| **Pipeline Value** | $50k+ | Sum of open opportunities | GHL Pipeline |
| **Lost Reason Breakdown** | N/A | Count by lost reason tag | GHL Tags |

### Dashboard Setup (GHL)
1. Create custom report in GHL: "Pricing Gate Leads Dashboard"
2. Add widgets:
   - Lead source breakdown (UTM source)
   - Pipeline stage distribution (funnel chart)
   - Lead score histogram
   - Email/SMS engagement stats
   - Won/lost by month (trend chart)
   - Avg. time in each pipeline stage
3. Schedule weekly email: Send to owner/team every Monday 9am

---

**Next Document:** `06_TRACKING_PLAN.md` - GA4, GTM, Conversion APIs

