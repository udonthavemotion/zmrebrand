export type PricingTier = {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  tagline: string;
  priceRange: string; // e.g., "Custom Quote"
  description: string;
  features: string[];
  included: string[];
  addOns?: string[];
  popular?: boolean;
  ctaText: string;
  ctaHref: string;
  formId: string; // ZRM form ID for this tier
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Automation Starter",
    tagline: "Never miss a lead again with basic automation",
    priceRange: "Custom Quote",
    description: "Best for: new or single-location businesses ready to automate lead capture. Result: Save 5-10 hours/week on manual follow-ups, capture every lead automatically.",
    features: [
      "Missed Call Text-Back — instant SMS to every missed caller",
      "Basic GHL CRM setup with lead capture forms",
      "Automation platform (website) with booking integration",
      "Google Business Profile connection for local visibility",
      "Monthly automation performance reports"
    ],
    included: [
      "Missed Call Text-Back — instant SMS to every missed caller",
      "Basic GHL CRM setup with lead capture forms",
      "Automation platform (website) with booking integration",
      "Google Business Profile connection for local visibility",
      "Monthly automation performance reports"
    ],
    ctaText: "Start Automating",
    ctaHref: "/pricing",
    formId: "starter-plan-form"
  },
  {
    id: "growth",
    name: "Automation Pro",
    tagline: "Full automation suite — AI agents + smart workflows",
    priceRange: "Custom Quote",
    description: "Best for: busy owners ready to scale with AI. Result: Increase bookings by 30-40%, reduce no-shows by 50%, save 15+ hours/week on repetitive tasks.",
    features: [
      "Custom AI Voice Agent — handles calls, books appointments, qualifies leads 24/7",
      "ZeroMotion Automations — smart text follow-ups, reminders, review requests",
      "Advanced lead conversion funnels with automated nurture sequences",
      "CRM pipeline automation with multi-channel tracking",
      "Bi-weekly optimization calls to improve conversion rates"
    ],
    included: [
      "Custom AI Voice Agent — handles calls, books appointments, qualifies leads 24/7",
      "ZeroMotion Automations — smart text follow-ups, reminders, review requests",
      "Advanced lead conversion funnels with automated nurture sequences",
      "CRM pipeline automation with multi-channel tracking",
      "Bi-weekly optimization calls to improve conversion rates"
    ],
    popular: true,
    ctaText: "Book Strategy Call",
    ctaHref: "/pricing",
    formId: "growth-plan-form"
  },
  {
    id: "scale",
    name: "Automation Enterprise",
    tagline: "Enterprise-level automation + AI agents + paid ad integration",
    priceRange: "Custom Quote",
    description: "Best for: multi-location businesses or brands running paid ads. Result: Predictable lead flow, 50%+ lower cost per acquisition, full automation of sales + service workflows.",
    features: [
      "AI Voice + Chat Agents across multiple channels (phone, SMS, web chat)",
      "Advanced ZeroMotion CRM with multi-location pipeline management",
      "Google/Meta ad integration with automated lead routing and follow-up",
      "A/B testing automation for funnels and messaging optimization",
      "Weekly strategy sessions with real-time revenue dashboard access",
      "Custom integrations (calendaring, payment processing, inventory systems)"
    ],
    included: [
      "AI Voice + Chat Agents across multiple channels (phone, SMS, web chat)",
      "Advanced ZeroMotion CRM with multi-location pipeline management",
      "Google/Meta ad integration with automated lead routing and follow-up",
      "A/B testing automation for funnels and messaging optimization",
      "Weekly strategy sessions with real-time revenue dashboard access",
      "Custom integrations (calendaring, payment processing, inventory systems)"
    ],
    addOns: [
      "White-label automation solutions for agencies",
      "Additional AI agent customization and training",
      "Advanced multi-location reputation management automation",
      "Custom API development for enterprise integrations"
    ],
    ctaText: "See Demo",
    ctaHref: "/pricing",
    formId: "scale-plan-form"
  }
];

// Legacy support - keep existing structure for backward compatibility
export type PackageTier = {
  id: string;
  title: string;
  priceCents: number; // per month
  blurb: string;
  includes: string[];
};

export const packages: PackageTier[] = [
  {
    id: "starter",
    title: "Starter",
    priceCents: 35000,
    blurb: "Site care, GBP, monthly report.",
    includes: [
      "1-page site + hosting",
      "Google Business Profile",
      "Monthly performance report",
      "Basic uptime & security",
      "Contact form + email routing",
      "Local tracking numbers (optional)",
    ],
  },
  {
    id: "growth",
    title: "Growth",
    priceCents: 50000,
    blurb: "+ 2 campaigns, review requests, basic SEO.",
    includes: [
      "Everything in Starter",
      "2 lead-gen campaigns",
      "Review request automations",
      "Basic on-page SEO",
      "GBP posts + photo updates",
      "Quarterly check-in",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    priceCents: 80000,
    blurb: "+ ZRM pipeline, SMS follow-ups, quarterly strategy.",
    includes: [
      "Everything in Growth",
      "ZRM pipeline setup",
      "SMS follow-ups",
      "Quarterly strategy call",
      "3 campaigns active",
      "CRM + call tracking",
    ],
  },
];
