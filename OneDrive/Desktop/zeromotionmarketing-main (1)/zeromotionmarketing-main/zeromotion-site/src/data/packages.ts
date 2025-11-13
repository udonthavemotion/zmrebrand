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
    name: "Starter Website",
    tagline: "Get online fast and start capturing leads",
    priceRange: "Custom Quote",
    description: "Best for: new or single-location businesses. Result: Look legit, get found, and make it easy to contact you.",
    features: [
      "Custom 1–3 page website with booking + contact",
      "Your brand, your domain, SSL, fast hosting",
      "Google Business Profile connected",
      "Basic analytics and monthly check-ins"
    ],
    included: [
      "Custom 1–3 page website with booking + contact",
      "Your brand, your domain, SSL, fast hosting",
      "Google Business Profile connected",
      "Basic analytics and monthly check-ins"
    ],
    ctaText: "See details",
    ctaHref: "/pricing",
    formId: "starter-plan-form"
  },
  {
    id: "growth",
    name: "Growth Marketing",
    tagline: "Automations that quietly bring you more bookings—day and night",
    priceRange: "Custom Quote",
    description: "Best for: busy owners who want more show-ups and 5-star reviews. Result: More booked calls from the same traffic—fewer no-shows.",
    features: [
      "High-converting funnel for one offer (page → form → calendar)",
      "Smart text follow-ups, reminders, and 'we missed you' saves",
      "Review + referral requests on autopilot",
      "Weekly posts + quick edits to keep things fresh",
      "Monthly reporting you can actually understand"
    ],
    included: [
      "High-converting funnel for one offer (page → form → calendar)",
      "Smart text follow-ups, reminders, and 'we missed you' saves",
      "Review + referral requests on autopilot",
      "Weekly posts + quick edits to keep things fresh",
      "Monthly reporting you can actually understand"
    ],
    popular: true,
    ctaText: "See details",
    ctaHref: "/pricing",
    formId: "growth-plan-form"
  },
  {
    id: "scale",
    name: "Scale & Dominate",
    tagline: "Full-stack growth: ads, funnels, content, and constant tuning",
    priceRange: "Custom Quote",
    description: "Best for: brands ready to scale with ads and a tight conversion engine. Result: Predictable pipeline, lower cost per lead, better ROI.",
    features: [
      "Google/Meta ads managed for you",
      "Advanced funnels + A/B testing to lift conversion",
      "Weekly creative/content support",
      "Reputation management + faster response times",
      "Bi-weekly strategy with a simple revenue dashboard"
    ],
    included: [
      "Google/Meta ads managed for you",
      "Advanced funnels + A/B testing to lift conversion",
      "Weekly creative/content support",
      "Reputation management + faster response times",
      "Bi-weekly strategy with a simple revenue dashboard"
    ],
    addOns: [
      "Additional custom integrations",
      "Advanced reporting dashboards",
      "Multi-location management",
      "White-label solutions"
    ],
    ctaText: "See details",
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
