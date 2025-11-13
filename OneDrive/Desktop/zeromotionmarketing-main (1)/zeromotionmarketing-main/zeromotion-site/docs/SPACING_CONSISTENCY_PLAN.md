# ZeroMotion Marketing - Spacing & Padding Consistency Plan
## Desktop & iPhone Optimization Strategy

**Date:** October 25, 2025  
**Site:** https://zeromotionmarketing.com  
**Objective:** Achieve consistent padding/margins, button sizes, and asset spacing across desktop (1280-1920px) and iPhone (375-414px) while preserving existing brand identity.

---

## Executive Summary

### Current State
- **467 instances** of hardcoded px values for padding/margin/gap across 23 files
- **119 instances** of hardcoded min-width/min-height values across 21 files
- Existing 8pt spacing system (`--zm-gap-*`) **already defined** but inconsistently applied
- Mix of Tailwind utilities and custom CSS creating spacing drift
- Some components use tokens, others use ad-hoc px values

### Proposed Solution
- **Consolidate** around existing token system with enhanced fluid variants
- **Rationalize** ~467 hard-coded spacings into 8–12 token values
- **Ensure** 44×44px minimum tap targets on mobile per WCAG 2.2
- **Add** iOS safe-area handling for notch/home indicator
- **Preserve** all existing colors, typography, imagery, and layout spirit

### Expected Impact
- ✅ Consistent spacing rhythm across all pages
- ✅ Improved mobile usability (WCAG 2.2 compliant tap targets)
- ✅ Better maintainability (single source of truth for spacing)
- ✅ No visual regression (colors/fonts unchanged)
- ✅ Performance neutral or improved (fewer unique styles)

### Non-Goals
- ❌ No color palette changes
- ❌ No typography adjustments
- ❌ No layout restructuring
- ❌ No imagery changes
- ❌ No heavy JavaScript solutions

---

## 1. Research & Source-Backed Guidance

### Key Takeaways from Community Sources

#### 1.1 Fluid Typography & Spacing with `clamp()`
**Source:** [CSS-Tricks: Consistent Fluidly Scaling Type and Spacing](https://css-tricks.com/consistent-fluidly-scaling-type-and-spacing/) (2023)

> "Using CSS `clamp()` for both typography and spacing ensures a harmonious scale that adapts seamlessly across viewport sizes without breakpoint fatigue."

**Why this matters:** Eliminates need for multiple media queries; spacing scales naturally between phone and desktop.

---

#### 1.2 Responsive Layouts Without Media Queries
**Source:** [Smashing Magazine: Beyond CSS Media Queries](https://www.smashingmagazine.com/2024/05/beyond-css-media-queries/) (2024)

> "CSS Grid with `auto-fit` and `minmax()` combined with container queries creates intrinsically responsive components that don't rely on viewport breakpoints."

**Why this matters:** Reduces breakpoint complexity; components adapt to their container, not just viewport.

---

#### 1.3 Container Queries for Modular Components
**Source:** [CSS-Tricks Newsletter #256: When to Use Container Queries](https://css-tricks.com/newsletter/256-when-to-use-container-queries/) (2023)

> "Container queries enable components to adjust their layout and spacing based on their container's size, promoting true component-driven design."

**Why this matters:** Your cards, buttons, and forms can self-adjust padding based on available space.

---

#### 1.4 WCAG 2.2 Touch Target Guidance
**Source:** [W3C WCAG 2.2 Success Criterion 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (2023)

> "Interactive elements should have a minimum target size of 24×24 CSS pixels, with a recommended minimum of 44×44 CSS pixels for primary actions to ensure accessibility on touch devices."

**Why this matters:** Ensures all buttons, links, and form controls are easily tappable on iPhone without zooming.

---

#### 1.5 iOS Safari Safe Area Insets
**Source:** [WebKit Blog: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) (Evergreen)

> "Use `env(safe-area-inset-*)` to respect the notch, rounded corners, and home indicator area on modern iPhones."

**Why this matters:** Prevents content from being obscured by iPhone notch or home indicator.

---

#### 1.6 8pt Grid System Standard
**Source:** [Material Design Spacing Methods](https://m3.material.io/foundations/layout/applying-layout/spacing) (Evergreen)

> "An 8dp (density-independent pixel) grid provides a consistent rhythm for spacing. All spacing should be multiples of 8 (4, 8, 16, 24, 32, 48, 64, etc.)."

**Why this matters:** Your site **already uses** an 8pt system (`--zm-gap-*`); we're consolidating usage.

---

#### 1.7 CSS Logical Properties for Future-Proofing
**Source:** [MDN: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) (2024)

> "Using logical properties like `padding-inline` and `padding-block` instead of `padding-left/right/top/bottom` improves support for RTL languages and future writing modes."

**Why this matters:** Makes your codebase more maintainable and internationally friendly.

---

#### 1.8 Avoiding 100vh Bugs on Mobile
**Source:** [CSS-Tricks: The Large, Small, and Dynamic Viewport Units](https://css-tricks.com/the-large-small-and-dynamic-viewports/) (2023)

> "Use `100dvh` (dynamic viewport height) instead of `100vh` to account for mobile browser chrome that appears/disappears on scroll."

**Why this matters:** Your site **already uses** `100svh` and `100dvh` fallbacks correctly; maintain this pattern.

---

#### 1.9 Reduced Motion Preferences
**Source:** [web.dev: Prefers Reduced Motion](https://web.dev/prefers-reduced-motion/) (2022)

> "Respect `prefers-reduced-motion` by disabling animations and transitions for users who have motion sensitivity."

**Why this matters:** Your site **already respects** this; maintain in all new utilities.

---

#### 1.10 Touch-Friendly Spacing on Mobile
**Source:** [Luke Wroblewski: Designing for Thumb Flow](https://www.lukew.com/ff/entry.asp?1927) (Evergreen)

> "Interactive elements should have at least 8-12px of spacing from adjacent elements to prevent accidental taps."

**Why this matters:** Critical for form fields, buttons in button groups, and nav items on mobile.

---

#### 1.11 Container Query Best Practices
**Source:** [Ahmad Shadeed: Say Hello to CSS Container Queries](https://ishadeed.com/article/say-hello-to-css-container-queries/) (2023)

> "Use container queries for component-level responsive design; reserve media queries for global layout shifts."

**Why this matters:** Your pricing cards, hero buttons, and forms can adapt padding without touching global breakpoints.

---

#### 1.12 Performance: Hardware Acceleration for Transforms
**Source:** [CSS-Tricks: Forcing Hardware Acceleration](https://css-tricks.com/almanac/properties/t/transform/#aa-forcing-hardware-acceleration) (Evergreen)

> "Using `transform: translateZ(0)` or `will-change: transform` forces GPU acceleration for smoother animations, especially on mobile."

**Why this matters:** Your hero video and hover effects already use this; maintain pattern for consistency.

---

## 2. Site Audit: Current Spacing Patterns

### 2.1 Page & Component Inventory

| Category | Components/Pages |
|----------|------------------|
| **Layouts** | `BaseLayout.astro` (global wrapper) |
| **Navigation** | `Navbar.astro` (desktop + mobile drawer) |
| **Hero Sections** | `Hero.astro`, `BackgroundSectionVideo.astro`, `BackgroundSectionImage.astro` |
| **Content Sections** | `ImplementationHierarchySection.astro`, `ChoiceSection.astro`, `Services.astro`, `About.astro` |
| **Cards** | `PlanCard.astro`, `ValueCards.astro`, `Packages.astro` |
| **Forms** | `PlanIntakeEmbed.astro`, `Contact.astro`, `GHLForm.astro` |
| **Modals** | `LeadModal.astro`, `StrategistModal.astro`, `ModernBookingModal.astro` |
| **CTAs** | `CRMRegistrationCTA.astro`, `CtaBanner.astro` |
| **Footer** | `Footer.astro` |
| **Utility** | `CookieConsent.astro`, `SEOInternalLinks.astro` |
| **Pages** | `/`, `/pricing`, `/about`, `/contact`, `/services/*`, `/plans/*` |

---

### 2.2 Extracted Spacing Patterns

#### Currently Defined Tokens (Already in `global.css`)
```css
:root {
  /* Safe area insets (iOS) */
  --sa-top: env(safe-area-inset-top, 0px);
  --sa-right: env(safe-area-inset-right, 0px);
  --sa-bottom: env(safe-area-inset-bottom, 0px);
  --sa-left: env(safe-area-inset-left, 0px);

  /* Minimal spacing scale (INCOMPLETE - only 5 values) */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */

  /* Enhanced 8pt Spacing System (PRIMARY) */
  --zm-gap-xs: 4px;    /* 0.25rem */
  --zm-gap-sm: 8px;    /* 0.5rem */
  --zm-gap-md: 16px;   /* 1rem */
  --zm-gap-lg: 24px;   /* 1.5rem */
  --zm-gap-xl: 32px;   /* 2rem */
  --zm-gap-2xl: 48px;  /* 3rem */
  --zm-gap-3xl: 64px;  /* 4rem */

  /* Border Radius */
  --zm-radius: 8px;
  --zm-radius-sm: 4px;
  --zm-radius-lg: 12px;
  --zm-radius-xl: 16px;
}
```

#### Ad-hoc Hardcoded Values Found (Sample)
```css
/* Examples from codebase audit */
padding: 18px 36px;          /* .btn */
padding: 30px;               /* .pkg */
padding: 12px 16px;          /* buttons @media 480px */
padding: 16px 24px;          /* buttons @media 481-768px */
padding: 20px 40px;          /* hero .btn-primary */
padding: 16px 32px;          /* nav .btn-primary */
gap: 12px;                   /* hero-crm-content */
gap: 10px;                   /* @media 640px */
gap: 8px;                    /* various */
min-height: 44px;            /* good! */
min-height: 54px;            /* .btn */
min-height: 56px;            /* plan card buttons */
margin-bottom: 15px;         /* plan-price */
margin: 20px auto 0;         /* card buttons */
border-radius: 24px;         /* buttons (not using --zm-radius tokens) */
border-radius: 20px;         /* .pkg */
border-radius: 28px;         /* hero-crm-btn */
```

---

### 2.3 Inconsistency Classification

| Severity | Issue | Example | Impact |
|----------|-------|---------|--------|
| **Critical** | Button padding varies by context | Nav: `16px 32px`, Hero: `20px 40px`, Card: `18px 36px` | Confusing tap targets; inconsistent feel |
| **Critical** | Button min-height varies | `.btn`: `54px`, card buttons: `56px`, mobile fallback: `44px` | Accessibility risk if <44px on mobile |
| **Moderate** | Card padding not tokenized | `.pkg`: `30px` (not using tokens) | Hard to maintain; not fluid |
| **Moderate** | Gap values scattered | `8px`, `10px`, `12px` in different components | Visual rhythm broken |
| **Moderate** | Border-radius not using tokens | Buttons use `24px`, `28px` instead of `--zm-radius-*` | Inconsistent corners |
| **Low** | Margin values | `15px`, `20px` margins not on 8pt grid | Minor visual noise |

---

## 3. Proposed Unified Spacing System

### 3.1 Complete Token Scale (Extends Existing)

```css
:root {
  /* ============================================
     SPACING TOKENS - 4pt/8pt Grid
     All values in rem for scalability
     ============================================ */
  
  /* Base scale (4pt increments) */
  --space-0: 0;           /* 0px */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.5rem;      /* 24px */
  --space-6: 2rem;        /* 32px */
  --space-7: 3rem;        /* 48px */
  --space-8: 4rem;        /* 64px */
  --space-9: 6rem;        /* 96px */
  --space-10: 8rem;       /* 128px */

  /* Fluid variants (scale between mobile and desktop) */
  --space-fluid-xs: clamp(0.25rem, 0.5vw + 0.125rem, 0.5rem);    /* 4-8px */
  --space-fluid-sm: clamp(0.5rem, 1vw + 0.25rem, 1rem);          /* 8-16px */
  --space-fluid-md: clamp(1rem, 2vw + 0.5rem, 1.5rem);           /* 16-24px */
  --space-fluid-lg: clamp(1.5rem, 3vw + 0.75rem, 2.5rem);        /* 24-40px */
  --space-fluid-xl: clamp(2rem, 4vw + 1rem, 4rem);               /* 32-64px */
  --space-fluid-2xl: clamp(3rem, 5vw + 1.5rem, 6rem);            /* 48-96px */

  /* Component-specific spacing (semantic tokens) */
  --space-section-block: var(--space-fluid-2xl);  /* Section vertical padding */
  --space-section-inline: var(--space-fluid-lg);  /* Section horizontal padding */
  --space-container-inline: clamp(1.25rem, 3vw + 0.5rem, 1.5rem); /* Container horizontal padding */
  --space-card-padding: var(--space-fluid-lg);    /* Card inner padding */
  --space-button-inline: var(--space-fluid-md);   /* Button horizontal padding */
  --space-button-block: clamp(0.75rem, 1.5vw + 0.5rem, 1.125rem); /* Button vertical padding */
  --space-gap-elements: var(--space-fluid-sm);    /* Gap between inline elements */

  /* ============================================
     SIZING TOKENS - Button & Tap Targets
     Ensures WCAG 2.2 compliance (min 44x44px on mobile)
     ============================================ */
  
  /* Button heights */
  --size-button-primary: clamp(2.75rem, 3vw + 2rem, 3.375rem);   /* 44-54px */
  --size-button-secondary: clamp(2.25rem, 2.5vw + 1.75rem, 2.75rem); /* 36-44px */
  --size-button-compact: 2.25rem;   /* 36px - for dense desktop UIs */
  --size-button-icon: 2.75rem;      /* 44px - icon-only buttons */

  /* Button padding (inline) */
  --padding-button-primary: clamp(1.5rem, 2vw + 1rem, 2.5rem);   /* 24-40px */
  --padding-button-secondary: clamp(1rem, 1.5vw + 0.75rem, 1.75rem); /* 16-28px */

  /* ============================================
     BORDER RADIUS TOKENS
     Consolidate existing --zm-radius-* with button-specific values
     ============================================ */
  
  --radius-xs: 0.25rem;   /* 4px */
  --radius-sm: 0.5rem;    /* 8px */
  --radius-md: 0.75rem;   /* 12px */
  --radius-lg: 1rem;      /* 16px */
  --radius-xl: 1.25rem;   /* 20px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-3xl: 1.75rem;  /* 28px */
  --radius-full: 9999px;  /* Fully rounded */

  /* Button-specific radius (semantic) */
  --radius-button: var(--radius-2xl);     /* 24px - primary buttons */
  --radius-button-hero: var(--radius-3xl); /* 28px - hero buttons */
  --radius-card: var(--radius-xl);        /* 20px - cards */

  /* ============================================
     SAFE AREA UTILITIES (iOS)
     Already defined; keep for reference
     ============================================ */
  
  --sa-top: env(safe-area-inset-top, 0px);
  --sa-right: env(safe-area-inset-right, 0px);
  --sa-bottom: env(safe-area-inset-bottom, 0px);
  --sa-left: env(safe-area-inset-left, 0px);

  /* ============================================
     Z-INDEX MANAGEMENT
     Already defined; keep unchanged
     ============================================ */
  
  /* (Existing z-index tokens remain unchanged) */
}
```

---

### 3.2 Fluid Spacing Formula Rationale

```
clamp(MIN, PREFERRED, MAX)

Where:
- MIN: Minimum value at 360px viewport (iPhone SE)
- PREFERRED: Fluid value using vw units + base
- MAX: Maximum value at 1440px viewport (desktop)

Example:
--space-fluid-lg: clamp(1.5rem, 3vw + 0.75rem, 2.5rem);
            24px at 360px → ~32px at 768px → 40px at 1440px
```

**Viewport Test Points:**
- 360px (iPhone SE / small Android)
- 390px (iPhone 14/15 Pro)
- 414px (iPhone 14/15 Pro Max)
- 768px (iPad portrait)
- 1024px (iPad landscape / small desktop)
- 1280px (typical laptop)
- 1440px (large desktop)
- 1920px (FHD desktop)

---

### 3.3 Button Sizing Tokens (WCAG 2.2 Compliant)

```css
/* ============================================
   BUTTON SIZE MAPPING
   Ensures 44x44px minimum on mobile
   ============================================ */

/* Primary CTA (most important) */
.btn-primary {
  min-block-size: var(--size-button-primary);  /* 44-54px */
  min-inline-size: var(--size-button-primary);
  padding-inline: var(--padding-button-primary); /* 24-40px */
  padding-block: var(--space-button-block);     /* 12-18px */
  border-radius: var(--radius-button);          /* 24px */
  gap: var(--space-2);                          /* 8px */
}

/* Secondary actions */
.btn-secondary,
.btn-ghost {
  min-block-size: var(--size-button-secondary); /* 36-44px */
  min-inline-size: var(--size-button-secondary);
  padding-inline: var(--padding-button-secondary); /* 16-28px */
  padding-block: var(--space-button-block);
  border-radius: var(--radius-button);
  gap: var(--space-2);
}

/* Icon-only buttons (nav hamburger, close icons) */
.btn-icon {
  min-block-size: var(--size-button-icon);      /* 44px */
  min-inline-size: var(--size-button-icon);
  padding: var(--space-2);                      /* 8px */
  border-radius: var(--radius-lg);              /* 16px */
}

/* Compact desktop variant (optional, for dense interfaces) */
.btn-compact {
  min-block-size: var(--size-button-compact);   /* 36px */
  padding-inline: var(--space-4);               /* 16px */
  padding-block: var(--space-2);                /* 8px */
  border-radius: var(--radius-lg);
  gap: var(--space-1);                          /* 4px */
}

/* Hero buttons (slightly larger) */
.hero-content .btn-primary {
  min-block-size: clamp(2.875rem, 3.5vw + 2rem, 3.5rem); /* 46-56px */
  padding-inline: clamp(2rem, 3vw + 1.5rem, 3rem);       /* 32-48px */
  border-radius: var(--radius-button-hero);               /* 28px */
}
```

---

## 4. Implementation Guidelines (CSS-First, Low Risk)

### 4.1 Root Token Layer (Add to `global.css`)

```css
/* ============================================
   ENHANCED SPACING TOKEN SYSTEM
   Add to :root block in global.css (line ~25)
   ============================================ */

:root {
  /* Complete 4pt/8pt spacing scale */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-9: 6rem;      /* 96px */
  --space-10: 8rem;     /* 128px */

  /* Fluid spacing (viewport-responsive) */
  --space-fluid-xs: clamp(0.25rem, 0.5vw + 0.125rem, 0.5rem);
  --space-fluid-sm: clamp(0.5rem, 1vw + 0.25rem, 1rem);
  --space-fluid-md: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  --space-fluid-lg: clamp(1.5rem, 3vw + 0.75rem, 2.5rem);
  --space-fluid-xl: clamp(2rem, 4vw + 1rem, 4rem);
  --space-fluid-2xl: clamp(3rem, 5vw + 1.5rem, 6rem);

  /* Semantic component spacing */
  --space-section-block: var(--space-fluid-2xl);
  --space-section-inline: var(--space-fluid-lg);
  --space-container-inline: clamp(1.25rem, 3vw + 0.5rem, 1.5rem);
  --space-card-padding: var(--space-fluid-lg);
  --space-button-inline: var(--space-fluid-md);
  --space-button-block: clamp(0.75rem, 1.5vw + 0.5rem, 1.125rem);
  --space-gap-elements: var(--space-fluid-sm);

  /* Button sizing (WCAG 2.2 compliant) */
  --size-button-primary: clamp(2.75rem, 3vw + 2rem, 3.375rem);
  --size-button-secondary: clamp(2.25rem, 2.5vw + 1.75rem, 2.75rem);
  --size-button-compact: 2.25rem;
  --size-button-icon: 2.75rem;
  --padding-button-primary: clamp(1.5rem, 2vw + 1rem, 2.5rem);
  --padding-button-secondary: clamp(1rem, 1.5vw + 0.75rem, 1.75rem);

  /* Border radius (consolidate with existing --zm-radius-*) */
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
  --radius-2xl: 1.5rem;
  --radius-3xl: 1.75rem;
  --radius-full: 9999px;
  --radius-button: var(--radius-2xl);
  --radius-button-hero: var(--radius-3xl);
  --radius-card: var(--radius-xl);
}
```

---

### 4.2 Utility Class Layer (Add to `global.css`)

```css
/* ============================================
   SPACING UTILITY CLASSES
   Extend existing .space-*, .p-*, .m-* utilities
   ============================================ */

/* Padding utilities (logical properties) */
.p-fluid-sm { padding: var(--space-fluid-sm); }
.p-fluid-md { padding: var(--space-fluid-md); }
.p-fluid-lg { padding: var(--space-fluid-lg); }
.p-fluid-xl { padding: var(--space-fluid-xl); }

.p-inline-fluid-sm { padding-inline: var(--space-fluid-sm); }
.p-inline-fluid-md { padding-inline: var(--space-fluid-md); }
.p-inline-fluid-lg { padding-inline: var(--space-fluid-lg); }
.p-inline-fluid-xl { padding-inline: var(--space-fluid-xl); }

.p-block-fluid-sm { padding-block: var(--space-fluid-sm); }
.p-block-fluid-md { padding-block: var(--space-fluid-md); }
.p-block-fluid-lg { padding-block: var(--space-fluid-lg); }
.p-block-fluid-xl { padding-block: var(--space-fluid-xl); }

/* Gap utilities */
.gap-fluid-xs { gap: var(--space-fluid-xs); }
.gap-fluid-sm { gap: var(--space-fluid-sm); }
.gap-fluid-md { gap: var(--space-fluid-md); }
.gap-fluid-lg { gap: var(--space-fluid-lg); }
.gap-fluid-xl { gap: var(--space-fluid-xl); }

/* Section spacing (semantic) */
.section-spacing {
  padding-block: var(--space-section-block);
  padding-inline: var(--space-section-inline);
}

/* Container spacing */
.container-spacing {
  padding-inline: var(--space-container-inline);
}

/* Card spacing */
.card-spacing {
  padding: var(--space-card-padding);
}

/* Safe-area utilities (iOS) */
.pad-safe-bottom {
  padding-bottom: calc(var(--space-4) + var(--sa-bottom));
}

.pad-safe-top {
  padding-top: calc(var(--space-3) + var(--sa-top));
}

.pad-safe-inline {
  padding-inline-start: calc(var(--space-4) + var(--sa-left));
  padding-inline-end: calc(var(--space-4) + var(--sa-right));
}

/* Tap target utility */
.tap-target {
  min-block-size: var(--size-button-icon); /* 44px */
  min-inline-size: var(--size-button-icon);
}
```

---

### 4.3 Button Component Refactor (Replace in `global.css`)

```css
/* ============================================
   MODERN BUTTON SYSTEM (2024 Standards)
   Replace existing .btn styles (line ~962)
   ============================================ */

.btn {
  /* Layout & sizing */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-block-size: var(--size-button-primary);
  min-inline-size: var(--size-button-primary);
  padding-inline: var(--padding-button-primary);
  padding-block: var(--space-button-block);
  gap: var(--space-2);

  /* Typography */
  font-size: clamp(0.875rem, 1vw + 0.75rem, 1rem); /* 14-16px */
  font-weight: 600;
  font-family: var(--zm-font-primary);
  letter-spacing: 0.025em;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  line-height: 1;

  /* Visuals */
  border-radius: var(--radius-button);
  border: 2px solid transparent;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  outline: none;

  /* Effects */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transform-style: preserve-3d;
  will-change: transform, box-shadow;

  /* Accessibility */
  position: relative;
  overflow: hidden;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
    will-change: auto;
  }
}

/* Primary button variant */
.btn-primary,
.btn.cta {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(139, 92, 246, 0.4),
    0 4px 16px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(139, 92, 246, 0.5),
    0 6px 20px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Secondary/ghost button variant */
.btn-secondary,
.btn-ghost {
  min-block-size: var(--size-button-secondary);
  min-inline-size: var(--size-button-secondary);
  padding-inline: var(--padding-button-secondary);
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.4);
  color: #ffffff;
}

.btn-secondary:hover,
.btn-secondary:focus-visible,
.btn-ghost:hover,
.btn-ghost:focus-visible {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
  transform: translateY(-2px);
}

/* Icon-only button */
.btn-icon {
  min-block-size: var(--size-button-icon);
  min-inline-size: var(--size-button-icon);
  padding: var(--space-2);
  border-radius: var(--radius-lg);
}

/* Compact desktop button (optional) */
.btn-compact {
  min-block-size: var(--size-button-compact);
  padding-inline: var(--space-4);
  padding-block: var(--space-2);
  font-size: 0.875rem;
  gap: var(--space-1);
}

/* Hero button variant (larger) */
.hero-content .btn-primary {
  min-block-size: clamp(2.875rem, 3.5vw + 2rem, 3.5rem);
  padding-inline: clamp(2rem, 3vw + 1.5rem, 3rem);
  border-radius: var(--radius-button-hero);
  font-size: clamp(0.9375rem, 1.2vw + 0.75rem, 1.125rem);
  font-weight: 700;
}

/* Focus states (WCAG 2.2) */
.btn:focus-visible {
  outline: 3px solid rgba(139, 92, 246, 0.5);
  outline-offset: 3px;
}

/* Touch-active state (mobile) */
.btn.touch-active {
  transform: translateY(0) scale(0.98);
}
```

---

### 4.4 Card Component Refactor (Replace in `global.css`)

```css
/* ============================================
   CARD & PRICING CARD SYSTEM
   Replace existing .card, .pkg styles (line ~749)
   ============================================ */

.card,
.pkg {
  /* Layout & spacing */
  padding: var(--space-card-padding);
  border-radius: var(--radius-card);

  /* Visuals */
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Effects */
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card:hover,
.pkg:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(139, 92, 246, 0.8);
  box-shadow:
    0 20px 50px rgba(139, 92, 246, 0.3),
    0 8px 25px rgba(139, 92, 246, 0.2);
  transform: translateY(-6px) scale(1.02);
}

/* Popular card variant */
.pkg.popular,
.card.popular {
  border: 3px solid #8b5cf6;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05));
  overflow: visible; /* Allow badge to show */
}

.pkg.popular:hover,
.card.popular:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.1));
  box-shadow:
    0 25px 60px rgba(139, 92, 246, 0.4),
    0 12px 30px rgba(139, 92, 246, 0.25);
}

/* Badge (for "Most Popular" labels) */
.badge {
  position: absolute;
  top: calc(-1 * var(--space-3));
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-elevated);
  padding-inline: var(--space-4);
  padding-block: var(--space-2);
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: var(--radius-lg);
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
}

/* Card button styling */
.card .btn,
.pkg .btn {
  width: 100%;
  margin-block-start: var(--space-5);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .card,
  .pkg {
    padding: clamp(1rem, 3vw + 0.5rem, 1.5rem);
  }

  .card:hover,
  .pkg:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

/* Prevent hover on touch devices (sticky hover fix) */
@media (hover: none) and (pointer: coarse) {
  .card:hover,
  .pkg:hover {
    transform: none;
    box-shadow: none;
  }
}
```

---

### 4.5 Container Query Pattern (Example for Cards)

```css
/* ============================================
   CONTAINER QUERY PATTERN
   Add after card styles
   ============================================ */

/* Define container context */
.pricing-grid,
.service-grid,
.package-grid {
  container-type: inline-size;
  container-name: grid;
}

/* Card adapts to container width */
@container grid (min-width: 480px) {
  .card,
  .pkg {
    padding: var(--space-6); /* 32px */
  }
}

@container grid (max-width: 479px) {
  .card,
  .pkg {
    padding: var(--space-5); /* 24px */
  }
}

/* Button adapts to container width */
@container grid (max-width: 360px) {
  .card .btn,
  .pkg .btn {
    padding-inline: var(--space-4); /* 16px */
    font-size: 0.875rem;
  }
}
```

---

### 4.6 iOS Safe-Area Pattern (Footer Example)

```css
/* ============================================
   SAFE-AREA INSET PATTERN
   Apply to sticky headers/footers
   ============================================ */

/* Footer safe-area (home indicator) */
footer,
.footer--sticky {
  padding-block-end: calc(var(--space-4) + var(--sa-bottom));
}

/* Header safe-area (notch/status bar) */
header,
.header--sticky {
  padding-block-start: calc(var(--space-3) + var(--sa-top));
}

/* Fixed CTA bars (bottom) */
.cta-bar,
.modal-actions {
  padding-block-end: calc(var(--space-4) + var(--sa-bottom));
}

/* Full-viewport modals */
.modal-fullscreen {
  padding-inline-start: calc(var(--space-4) + var(--sa-left));
  padding-inline-end: calc(var(--space-4) + var(--sa-right));
  padding-block-start: calc(var(--space-6) + var(--sa-top));
  padding-block-end: calc(var(--space-6) + var(--sa-bottom));
}
```

---

### 4.7 Legacy Shim Layer (Temporary Aliases)

```css
/* ============================================
   LEGACY SHIM LAYER (Phase 1 only)
   Map old --zm-gap-* to new --space-* tokens
   Remove in Phase 3 after full migration
   ============================================ */

:root {
  /* Map old tokens to new tokens */
  --zm-gap-xs: var(--space-1);    /* 4px */
  --zm-gap-sm: var(--space-2);    /* 8px */
  --zm-gap-md: var(--space-4);    /* 16px */
  --zm-gap-lg: var(--space-5);    /* 24px */
  --zm-gap-xl: var(--space-6);    /* 32px */
  --zm-gap-2xl: var(--space-7);   /* 48px */
  --zm-gap-3xl: var(--space-8);   /* 64px */

  /* Map old radius tokens */
  --zm-radius: var(--radius-sm);     /* 8px */
  --zm-radius-sm: var(--radius-xs);  /* 4px */
  --zm-radius-lg: var(--radius-md);  /* 12px */
  --zm-radius-xl: var(--radius-lg);  /* 16px */
}
```

---

## 5. Copy-Paste Code Samples

### 5.1 Complete Token System (Add to `global.css`)

```css
/* ============================================
   ZEROMOTION SPACING TOKEN SYSTEM v2.0
   Add to :root block in src/styles/global.css
   ============================================ */

:root {
  /* Base spacing scale (4pt/8pt grid) */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-9: 6rem;      /* 96px */
  --space-10: 8rem;     /* 128px */

  /* Fluid spacing (responsive between 360px-1440px) */
  --space-fluid-xs: clamp(0.25rem, 0.5vw + 0.125rem, 0.5rem);
  --space-fluid-sm: clamp(0.5rem, 1vw + 0.25rem, 1rem);
  --space-fluid-md: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  --space-fluid-lg: clamp(1.5rem, 3vw + 0.75rem, 2.5rem);
  --space-fluid-xl: clamp(2rem, 4vw + 1rem, 4rem);
  --space-fluid-2xl: clamp(3rem, 5vw + 1.5rem, 6rem);

  /* Semantic spacing tokens */
  --space-section-block: var(--space-fluid-2xl);
  --space-section-inline: var(--space-fluid-lg);
  --space-container-inline: clamp(1.25rem, 3vw + 0.5rem, 1.5rem);
  --space-card-padding: var(--space-fluid-lg);
  --space-button-inline: var(--space-fluid-md);
  --space-button-block: clamp(0.75rem, 1.5vw + 0.5rem, 1.125rem);
  --space-gap-elements: var(--space-fluid-sm);

  /* Button sizing (WCAG 2.2 compliant - min 44px on mobile) */
  --size-button-primary: clamp(2.75rem, 3vw + 2rem, 3.375rem);
  --size-button-secondary: clamp(2.25rem, 2.5vw + 1.75rem, 2.75rem);
  --size-button-compact: 2.25rem;
  --size-button-icon: 2.75rem;
  --padding-button-primary: clamp(1.5rem, 2vw + 1rem, 2.5rem);
  --padding-button-secondary: clamp(1rem, 1.5vw + 0.75rem, 1.75rem);

  /* Border radius tokens */
  --radius-xs: 0.25rem;   /* 4px */
  --radius-sm: 0.5rem;    /* 8px */
  --radius-md: 0.75rem;   /* 12px */
  --radius-lg: 1rem;      /* 16px */
  --radius-xl: 1.25rem;   /* 20px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-3xl: 1.75rem;  /* 28px */
  --radius-full: 9999px;
  --radius-button: var(--radius-2xl);
  --radius-button-hero: var(--radius-3xl);
  --radius-card: var(--radius-xl);

  /* Safe area insets (iOS) - already defined */
  --sa-top: env(safe-area-inset-top, 0px);
  --sa-right: env(safe-area-inset-right, 0px);
  --sa-bottom: env(safe-area-inset-bottom, 0px);
  --sa-left: env(safe-area-inset-left, 0px);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-duration: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 5.2 Refactored Button Component

```css
/* ============================================
   BUTTON COMPONENT SYSTEM
   Replace existing .btn rules (line ~962 in global.css)
   ============================================ */

.btn {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* Sizing (WCAG 2.2: min 44x44px on mobile) */
  min-block-size: var(--size-button-primary);
  min-inline-size: var(--size-button-primary);
  padding-inline: var(--padding-button-primary);
  padding-block: var(--space-button-block);
  gap: var(--space-2);
  
  /* Typography */
  font-size: clamp(0.875rem, 1vw + 0.75rem, 1rem);
  font-weight: 600;
  font-family: var(--zm-font-primary);
  letter-spacing: 0.025em;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  
  /* Visuals */
  border-radius: var(--radius-button);
  border: 2px solid transparent;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  outline: none;
  
  /* Effects */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
  
  /* Positioning */
  position: relative;
  overflow: hidden;
}

/* Primary button */
.btn-primary,
.btn.cta {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(139, 92, 246, 0.4),
    0 4px 16px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(139, 92, 246, 0.5),
    0 6px 20px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-primary:active,
.btn-primary.touch-active {
  transform: translateY(0) scale(0.98);
  box-shadow:
    0 4px 16px rgba(139, 92, 246, 0.3),
    0 2px 8px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Secondary/ghost button */
.btn-secondary,
.btn-ghost {
  min-block-size: var(--size-button-secondary);
  min-inline-size: var(--size-button-secondary);
  padding-inline: var(--padding-button-secondary);
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.4);
  color: #ffffff;
}

.btn-secondary:hover,
.btn-secondary:focus-visible,
.btn-ghost:hover,
.btn-ghost:focus-visible {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
  transform: translateY(-2px);
  box-shadow:
    0 8px 24px rgba(139, 92, 246, 0.2),
    0 4px 12px rgba(139, 92, 246, 0.1);
}

/* Icon-only button */
.btn-icon {
  min-block-size: var(--size-button-icon);
  min-inline-size: var(--size-button-icon);
  padding: var(--space-2);
  border-radius: var(--radius-lg);
}

/* Compact button (desktop only) */
.btn-compact {
  min-block-size: var(--size-button-compact);
  padding-inline: var(--space-4);
  padding-block: var(--space-2);
  font-size: 0.875rem;
  gap: var(--space-1);
}

/* Hero button (larger) */
.hero-content .btn-primary {
  min-block-size: clamp(2.875rem, 3.5vw + 2rem, 3.5rem);
  padding-inline: clamp(2rem, 3vw + 1.5rem, 3rem);
  border-radius: var(--radius-button-hero);
  font-size: clamp(0.9375rem, 1.2vw + 0.75rem, 1.125rem);
  font-weight: 700;
  box-shadow:
    0 12px 40px rgba(139, 92, 246, 0.4),
    0 6px 20px rgba(139, 92, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Focus states (WCAG 2.2) */
.btn:focus-visible {
  outline: 3px solid rgba(139, 92, 246, 0.5);
  outline-offset: 3px;
}

/* Disabled state */
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
    will-change: auto;
  }
  .btn:hover,
  .btn:focus-visible {
    transform: none;
  }
}
```

---

### 5.3 Safe-Area Footer Example

```css
/* ============================================
   FOOTER WITH SAFE-AREA INSETS
   Apply to Footer.astro or global.css
   ============================================ */

footer,
.footer--sticky,
#main-footer {
  /* Base padding */
  padding-block-start: var(--space-6);  /* 32px */
  padding-block-end: calc(var(--space-6) + var(--sa-bottom)); /* 32px + safe-area */
  padding-inline: var(--space-container-inline);
  
  /* Sticky positioning (if applicable) */
  position: relative; /* or sticky if needed */
  z-index: var(--z-content);
  
  /* Visuals */
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0d0d1a 100%);
  border-block-start: 1px solid var(--zm-border);
}

/* Footer content container */
footer .container-page,
#main-footer .container-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-fluid-lg);
  max-width: 1280px;
  margin-inline: auto;
}

/* Footer sections */
.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.footer-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--zm-text-secondary);
  margin-block-end: var(--space-3);
}

.footer-section a {
  font-size: 0.875rem;
  color: var(--zm-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover,
.footer-section a:focus-visible {
  color: var(--zm-text);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  footer,
  .footer--sticky,
  #main-footer {
    padding-block-start: var(--space-5);
    padding-block-end: calc(var(--space-5) + var(--sa-bottom));
  }
}
```

---

### 5.4 Container Query Card Example

```css
/* ============================================
   CARD WITH CONTAINER QUERY
   Apply to pricing cards, service cards, etc.
   ============================================ */

/* Define container context (apply to parent grid) */
.pricing-grid,
.service-grid,
.package-grid {
  container-type: inline-size;
  container-name: card-grid;
  
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--space-fluid-lg);
}

/* Card component */
.card,
.pkg {
  /* Base styles */
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: var(--radius-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Default padding (mobile-first) */
  padding: var(--space-5); /* 24px */
}

/* Container query: adapt padding based on card container width */
@container card-grid (min-width: 480px) {
  .card,
  .pkg {
    padding: var(--space-6); /* 32px */
  }
}

@container card-grid (min-width: 640px) {
  .card,
  .pkg {
    padding: var(--space-fluid-lg); /* 24-40px fluid */
  }
}

/* Container query: adapt button text size */
@container card-grid (max-width: 360px) {
  .card .btn,
  .pkg .btn {
    font-size: 0.875rem;
    padding-inline: var(--space-4);
  }
}

/* Hover states */
.card:hover,
.pkg:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(139, 92, 246, 0.8);
  box-shadow:
    0 20px 50px rgba(139, 92, 246, 0.3),
    0 8px 25px rgba(139, 92, 246, 0.2);
  transform: translateY(-6px) scale(1.02);
}

/* Mobile: reduce transform */
@media (max-width: 768px) {
  .card:hover,
  .pkg:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

/* Touch devices: disable hover */
@media (hover: none) and (pointer: coarse) {
  .card:hover,
  .pkg:hover {
    transform: none;
  }
}
```

---

### 5.5 Spacing Linter Config (Stylelint)

Create `stylelint-spacing.config.js` in project root:

```javascript
// stylelint-spacing.config.js
// Enforces token usage; flags non-token px values

module.exports = {
  rules: {
    // Disallow hardcoded padding/margin values
    'declaration-property-value-disallowed-list': {
      '/^padding/': [
        // Allow 0, 1px (borders), but flag everything else
        '/^(?!0$|1px$|var\\(|calc\\(|clamp\\().*/i'
      ],
      '/^margin/': [
        '/^(?!0$|1px$|auto$|var\\(|calc\\(|clamp\\().*/i'
      ],
      '/^gap$/': [
        '/^(?!0$|var\\(|calc\\(|clamp\\().*/i'
      ],
    },
    
    // Disallow hardcoded border-radius (except 0, 50%, 9999px for circles)
    'declaration-property-value-disallowed-list': {
      'border-radius': [
        '/^(?!0$|50%$|9999px$|var\\(|calc\\(|clamp\\().*/i'
      ]
    },
    
    // Enforce logical properties
    'property-disallowed-list': [
      'padding-left',
      'padding-right',
      'padding-top',
      'padding-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'margin-bottom',
    ],
    
    // Allow exceptions for specific files
    'ignoreFiles': [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.min.css'
    ]
  }
};
```

**Run linter:**
```bash
npx stylelint "src/**/*.{css,astro}" --config stylelint-spacing.config.js
```

---

## 6. Acceptance Criteria & Test Plan

### 6.1 Quantitative Metrics

| Metric | Target | Test Method |
|--------|--------|-------------|
| **Tap target size (primary buttons)** | ≥ 44×44px on all viewports 375-414px | Manual measurement (Chrome DevTools) + Playwright assertion |
| **Tap target size (secondary buttons)** | ≥ 36×36px on mobile, ≥ 44×44px on desktop | Manual measurement |
| **Icon-only buttons** | ≥ 44×44px with visible 3px focus ring | Manual + accessibility audit |
| **Token usage** | 100% of padding/margin in components use `var(--space-*)` | Stylelint check (0 violations) |
| **Hardcoded px values** | ≤ 10 instances (only for 1px borders) | `grep -r "padding:\s*\d\+px" src/` |
| **Safe-area usage** | Footer, sticky header, modals use `env(safe-area-inset-*)` | Manual iPhone test |
| **Line length** | Body text max ~75ch; headings max ~60ch | Manual typography check |
| **Line height** | Body text 1.5-1.6; headings 1.1-1.2 | Manual CSS audit |
| **Element spacing (mobile)** | Adjacent interactive elements ≥ 8px apart | Manual iPhone test |
| **Border radius consistency** | All buttons use `--radius-button` or `--radius-button-hero` | Stylelint check |

---

### 6.2 Manual QA Checklist

#### Desktop (1280px, 1440px, 1920px)
- [ ] **Homepage**
  - [ ] Hero buttons: correct padding, aligned, 44×44px minimum
  - [ ] Nav buttons: consistent padding, aligned
  - [ ] Section padding: uses fluid tokens, visually balanced
  - [ ] Cards: consistent inner padding across all cards
  - [ ] Footer: sections evenly spaced
  
- [ ] **Pricing Page**
  - [ ] Plan cards: equal padding, buttons aligned
  - [ ] Badges: positioned correctly above cards
  - [ ] FAQ: consistent padding in accordion items
  - [ ] CTA buttons: match brand standards
  
- [ ] **Services Pages** (web-design, brand-identity, crm, ai-integration)
  - [ ] Hero sections: fluid padding
  - [ ] Process cards: consistent spacing
  - [ ] CTAs: proper sizing and spacing
  
- [ ] **Forms** (Contact, Plan Intake)
  - [ ] Form fields: consistent padding, proper focus states
  - [ ] Submit buttons: 44×44px minimum, proper padding
  - [ ] Field spacing: 16-24px between fields

#### iPhone (375px, 390px, 414px)
- [ ] **Homepage**
  - [ ] Hero buttons: ≥ 44×44px, tappable without zooming
  - [ ] Nav drawer: open/close buttons ≥ 44×44px
  - [ ] Safe-area: content not obscured by notch/home indicator
  - [ ] Section padding: sufficient whitespace on small screens
  
- [ ] **Pricing Page**
  - [ ] Plan cards: readable, buttons tappable
  - [ ] Mobile drawer: smooth open/close, proper spacing
  - [ ] Accordion: tap targets ≥ 44×44px
  
- [ ] **Forms**
  - [ ] Input fields: ≥ 44px tall, easy to tap
  - [ ] Buttons: ≥ 44×44px, not too close together
  - [ ] Error messages: readable, proper spacing
  
- [ ] **Modals** (Lead modal, strategist modal, booking modal)
  - [ ] Close button: ≥ 44×44px, top-right corner
  - [ ] Safe-area: bottom padding accounts for home indicator
  - [ ] Form fields: same as above

#### Cross-Page Consistency
- [ ] **Button sizes**: All primary buttons use consistent sizing
- [ ] **Card padding**: All cards (pricing, service, value) use consistent tokens
- [ ] **Section spacing**: All pages use `--space-section-block` for vertical rhythm
- [ ] **Nav behavior**: Desktop and mobile nav consistent across pages
- [ ] **Footer**: Identical layout and spacing across all pages

#### Accessibility
- [ ] **Focus states**: All interactive elements have visible 3px outline on focus
- [ ] **Keyboard navigation**: Tab order logical, no focus traps
- [ ] **Screen reader**: Headings hierarchical, buttons labeled
- [ ] **Color contrast**: Text meets WCAG AA (already compliant)
- [ ] **Reduced motion**: Animations disabled when `prefers-reduced-motion: reduce`

#### Performance
- [ ] **No layout shift**: CLS score < 0.1 (Lighthouse)
- [ ] **Button transitions**: Smooth on desktop, no jank on mobile
- [ ] **Hover states**: Desktop only (no sticky hover on touch devices)
- [ ] **Video playback**: Hero video stable, no flicker

---

### 6.3 Automated Test Examples (Playwright)

Create `tests/spacing-consistency.spec.ts`:

```typescript
// tests/spacing-consistency.spec.ts
import { test, expect, devices } from '@playwright/test';

// Test configuration
const PAGES = ['/', '/pricing', '/about', '/contact', '/services/web-design'];
const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 14', ...devices['iPhone 14'] },
  { name: 'iPhone 14 Pro Max', ...devices['iPhone 14 Pro Max'] }
];

// Test: Primary buttons meet 44x44px on mobile
test.describe('Button tap targets (mobile)', () => {
  for (const device of MOBILE_VIEWPORTS) {
    test(`Primary buttons ≥ 44x44px on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext(device);
      const page = await context.newPage();
      
      for (const url of PAGES) {
        await page.goto(url);
        
        const buttons = await page.locator('.btn-primary, .btn.cta').all();
        
        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
      
      await context.close();
    });
  }
});

// Test: Token usage (no hardcoded px in padding)
test('No hardcoded padding values in components', async ({ page }) => {
  await page.goto('/');
  
  // Inject script to check computed styles
  const hasHardcodedPadding = await page.evaluate(() => {
    const elements = document.querySelectorAll('.btn, .card, .pkg, section');
    const violations: string[] = [];
    
    elements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const padding = styles.padding;
      
      // Check if padding uses CSS variables (contains 'var(--')
      if (!padding.includes('var(--')) {
        violations.push(`${el.className}: ${padding}`);
      }
    });
    
    return violations;
  });
  
  expect(hasHardcodedPadding.length).toBe(0);
});

// Test: Safe-area insets applied on iPhone
test('Footer respects safe-area-inset on iPhone 14', async ({ browser }) => {
  const device = devices['iPhone 14'];
  const context = await browser.newContext(device);
  const page = await context.newPage();
  
  await page.goto('/');
  
  const footerPadding = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    
    const styles = window.getComputedStyle(footer);
    return {
      paddingBottom: styles.paddingBottom,
      hasCalc: styles.paddingBottom.includes('calc')
    };
  });
  
  expect(footerPadding?.hasCalc).toBe(true); // Should use calc(var(--space-*) + var(--sa-bottom))
  
  await context.close();
});

// Test: Focus states visible
test('All buttons have visible focus states', async ({ page }) => {
  await page.goto('/');
  
  const buttons = await page.locator('button, .btn, a[role="button"]').all();
  
  for (const button of buttons) {
    await button.focus();
    
    const outline = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle
      };
    });
    
    // Check for visible outline (>= 2px solid)
    const outlineWidth = parseInt(outline.outlineWidth);
    expect(outlineWidth).toBeGreaterThanOrEqual(2);
    expect(outline.outlineStyle).toBe('solid');
  }
});

// Test: Element spacing on mobile (adjacent buttons)
test('Adjacent buttons have ≥ 8px spacing on mobile', async ({ browser }) => {
  const device = devices['iPhone 14'];
  const context = await browser.newContext(device);
  const page = await context.newPage();
  
  await page.goto('/');
  
  // Check hero button group
  const buttonGroup = page.locator('.hero-content .flex');
  const gap = await buttonGroup.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return parseInt(styles.gap);
  });
  
  expect(gap).toBeGreaterThanOrEqual(8);
  
  await context.close();
});
```

**Run tests:**
```bash
npx playwright test tests/spacing-consistency.spec.ts
```

---

## 7. Rollout Plan (Risk-Managed, 3 Phases)

### Phase 1: Foundation (Low Risk, 2-3 days)
**Goal:** Introduce tokens and utilities without breaking existing UI.

**Actions:**
1. **Add new token system** to `global.css` (:root block)
   - Keep existing `--zm-gap-*` tokens (backward compatible)
   - Add new `--space-*`, `--space-fluid-*`, `--size-button-*`, `--radius-*` tokens
   - Add legacy shim layer mapping old → new tokens

2. **Add utility classes**
   - `.p-fluid-*`, `.gap-fluid-*`, `.section-spacing`, `.card-spacing`
   - `.pad-safe-*` utilities for iOS
   - `.tap-target` utility

3. **Feature flag** (optional)
   - Wrap new tokens in a CSS class `.spacing-v2`
   - Apply to `<body>` only on staging/dev for testing

4. **Visual regression check**
   - Take screenshots of all pages (Percy.io or manual)
   - Compare before/after to ensure zero drift

**Success Criteria:**
- [ ] All tokens defined, no syntax errors
- [ ] Existing UI unchanged (pixel-perfect match)
- [ ] No console errors or warnings
- [ ] Lighthouse scores unchanged

---

### Phase 2: Component Migration (Moderate Risk, 1-2 weeks)
**Goal:** Migrate shared components (buttons, cards, forms) to new token system.

**Actions:**
1. **Refactor button component** (`global.css` line ~962)
   - Replace all hardcoded padding/height/radius with tokens
   - Add `.btn-primary`, `.btn-secondary`, `.btn-icon`, `.btn-compact` variants
   - Test on all pages

2. **Refactor card component** (`global.css` line ~749)
   - Replace `.pkg`, `.card` padding with `var(--space-card-padding)`
   - Update hover transforms to use tokens

3. **Refactor footer** (`Footer.astro`)
   - Apply `pad-safe-bottom` utility
   - Replace hardcoded padding with tokens

4. **Refactor navbar** (`Navbar.astro`)
   - Apply `pad-safe-top` utility
   - Ensure mobile drawer uses tokens

5. **Refactor hero** (`Hero.astro`)
   - Update hero button sizing
   - Apply fluid section spacing

6. **Update forms** (`PlanIntakeEmbed.astro`, `Contact.astro`)
   - Ensure input heights ≥ 44px on mobile
   - Apply consistent field spacing

**Testing:**
- [ ] Manual QA on desktop (1280, 1440, 1920px)
- [ ] Manual QA on iPhone (375, 390, 414px)
- [ ] Playwright tests pass
- [ ] Stylelint check (no violations in migrated files)

**Rollback Plan:**
- Revert specific component file via Git
- Remove feature flag class from `<body>`
- Tokens remain (no breaking change)

---

### Phase 3: Full Site Sweep (Low Risk, 1 week)
**Goal:** Replace remaining hardcoded values, remove legacy shim.

**Actions:**
1. **Audit remaining components**
   - Run: `grep -r "padding:\s*\d\+px" src/`
   - Replace with tokens manually or via find/replace

2. **Remove legacy shim layer**
   - Delete `--zm-gap-* → --space-*` aliases
   - Update any remaining usages

3. **Run stylelint on entire codebase**
   - Fix all violations
   - Enforce token usage going forward

4. **Generate task files** (if using custom markdown per task)
   - Document all changes in changelog

5. **Final QA sweep**
   - Test all pages on all viewports
   - Run full Playwright suite
   - Lighthouse audit (performance/accessibility)

**Success Criteria:**
- [ ] Zero stylelint violations
- [ ] Zero hardcoded px values in padding/margin (except 1px borders)
- [ ] All Playwright tests green
- [ ] Lighthouse scores maintained or improved
- [ ] Manual QA checklist 100% complete

---

### Rollout Timeline (Example)

| Phase | Duration | Milestone |
|-------|----------|-----------|
| **Phase 1** | 2-3 days | Tokens added, staging test green |
| **Phase 2** | 1-2 weeks | Core components migrated, production deploy |
| **Phase 3** | 1 week | Full site migrated, legacy code removed |
| **Buffer** | 1-2 days | Final QA, documentation |
| **Total** | ~3 weeks | Complete rollout |

---

### Visual Diff Strategy

**Tools:**
- Percy.io (automated visual regression)
- Playwright snapshots
- Manual screenshot comparison (LambdaTest or BrowserStack)

**Test Matrix:**
| Browser | Viewports | Pages |
|---------|-----------|-------|
| Chrome | 375, 414, 768, 1280, 1440, 1920 | All (10 pages) |
| Safari (iOS) | 375, 390, 414 | All |
| Firefox | 1280, 1440 | Homepage, Pricing |
| Safari (macOS) | 1440 | Homepage, Pricing |

**Process:**
1. Take "before" screenshots (Phase 0)
2. Deploy Phase 1 to staging → take screenshots → compare
3. Deploy Phase 2 to staging → take screenshots → compare
4. Deploy Phase 3 to production → take screenshots → compare
5. Archive diffs in `docs/visual-regression/` folder

---

## 8. Deliverables

### 8.1 Executive Summary (This Section)
✅ See top of document.

---

### 8.2 Technical Appendix

#### A. Research References (With Links)
✅ See Section 1 above.

#### B. Token Table

| Token Name | Value (rem) | Px Equivalent @ 16px | Usage |
|------------|-------------|----------------------|-------|
| `--space-0` | 0 | 0px | Reset values |
| `--space-1` | 0.25rem | 4px | Icon spacing, micro-adjustments |
| `--space-2` | 0.5rem | 8px | Button icon gaps, tight spacing |
| `--space-3` | 0.75rem | 12px | Small padding, compact elements |
| `--space-4` | 1rem | 16px | Base unit, default padding |
| `--space-5` | 1.5rem | 24px | Card padding, section spacing |
| `--space-6` | 2rem | 32px | Large padding, section spacing |
| `--space-7` | 3rem | 48px | Extra-large spacing, hero sections |
| `--space-8` | 4rem | 64px | Section vertical spacing |
| `--space-9` | 6rem | 96px | Hero sections, landing areas |
| `--space-10` | 8rem | 128px | Mega spacing (rare) |
| `--space-fluid-xs` | clamp(...) | 4-8px | Micro fluid spacing |
| `--space-fluid-sm` | clamp(...) | 8-16px | Small fluid spacing |
| `--space-fluid-md` | clamp(...) | 16-24px | Medium fluid spacing |
| `--space-fluid-lg` | clamp(...) | 24-40px | Large fluid spacing |
| `--space-fluid-xl` | clamp(...) | 32-64px | Extra-large fluid spacing |
| `--space-fluid-2xl` | clamp(...) | 48-96px | Section vertical fluid spacing |

---

#### C. Copy-Paste CSS Blocks
✅ See Section 5 above.

---

#### D. Page/Component Audit Table (Before/After Padding Specs)

| Component | Location | Current Padding | Proposed Padding | Status |
|-----------|----------|----------------|------------------|--------|
| **Buttons** | `global.css:962` | `18px 36px` (hardcoded) | `var(--padding-button-primary)` `var(--space-button-block)` | Phase 2 |
| **Hero Buttons** | `Hero.astro:44` | `20px 40px` (hardcoded) | `clamp(2rem, 3vw + 1.5rem, 3rem)` | Phase 2 |
| **Nav Buttons** | `Navbar.astro:116` | `16px 32px` (hardcoded) | `var(--padding-button-primary)` | Phase 2 |
| **Card (.pkg)** | `global.css:764` | `30px` (hardcoded) | `var(--space-card-padding)` | Phase 2 |
| **Plan Card Button** | `PlanCard.astro:79` | `18px 24px; min-height: 56px` (hardcoded) | `var(--size-button-primary)` `var(--padding-button-primary)` | Phase 2 |
| **Footer** | `Footer.astro:6` | `py-1` (Tailwind, too small) | `pad-safe-block` utility | Phase 2 |
| **Navbar** | `Navbar.astro:17` | `h-14` (56px, hardcoded) | `min-block-size: var(--size-button-icon)` | Phase 2 |
| **Hero CRM Button** | `Hero.astro:154` | `padding: 16px 24px` (hardcoded) | `var(--padding-button-primary)` | Phase 2 |
| **Mobile Nav Items** | `Navbar.astro:179` | `px-4 py-3` (Tailwind) | `padding-inline: var(--space-4); padding-block: var(--space-3)` | Phase 3 |
| **Card Hover Transform** | `global.css:788` | `translateY(-6px) scale(1.02)` | Same (no change) | N/A |
| **Section Padding** | `global.css:159` | `var(--zm-gap-3xl)` (already tokens) | `var(--space-section-block)` | Phase 3 |
| **Container Padding** | `global.css:155` | `px-5 md:px-6` (Tailwind) | `padding-inline: var(--space-container-inline)` | Phase 3 |

---

#### E. QA Checklist
✅ See Section 6.2 above.

---

#### F. Playwright Test Scripts
✅ See Section 6.3 above.

---

## 9. Maintenance & Documentation

### 9.1 Post-Launch Monitoring

**Week 1 Post-Launch:**
- [ ] Monitor analytics for bounce rate changes
- [ ] Check Sentry/Lighthouse for layout shift regressions
- [ ] Collect user feedback (support tickets, contact forms)
- [ ] Review Hotjar heatmaps (if applicable) for button tap patterns

**Week 2-4:**
- [ ] Run full Playwright suite weekly
- [ ] Monitor Core Web Vitals (CLS, LCP, FID)
- [ ] Check stylelint on new PRs (enforce token usage)

**Monthly:**
- [ ] Audit for new hardcoded px values
- [ ] Update token system if new patterns emerge
- [ ] Review accessibility audit (Axe DevTools)

---

### 9.2 Developer Documentation

**Add to `README.md` or `CONTRIBUTING.md`:**

```markdown
## Spacing & Layout System

ZeroMotion uses a **token-based spacing system** built on a 4pt/8pt grid. All padding, margin, gap, and sizing values should use CSS custom properties (tokens) defined in `src/styles/global.css`.

### Usage Guidelines

#### ✅ DO:
- Use tokens: `padding: var(--space-4);`
- Use fluid tokens for responsive spacing: `padding: var(--space-fluid-lg);`
- Use logical properties: `padding-inline`, `padding-block`
- Use semantic tokens: `padding: var(--space-card-padding);`

#### ❌ DON'T:
- Hardcode px values: `padding: 20px;` ❌
- Use old-style properties: `padding-left`, `padding-right` ❌
- Use arbitrary Tailwind classes: `p-5` ❌ (use utilities instead)

### Available Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | Reset |
| `--space-1` | 0.25rem (4px) | Micro spacing |
| `--space-2` | 0.5rem (8px) | Button gaps |
| `--space-4` | 1rem (16px) | Base padding |
| `--space-5` | 1.5rem (24px) | Card padding |
| `--space-fluid-lg` | clamp(24px, 3vw + 12px, 40px) | Responsive padding |
| `--size-button-primary` | clamp(44px, ..., 54px) | Button height (WCAG 2.2) |

### Linting

Run spacing linter before committing:
```bash
npx stylelint "src/**/*.{css,astro}" --config stylelint-spacing.config.js
```

### Accessibility

All interactive elements must meet WCAG 2.2 touch target requirements:
- Primary buttons: ≥ 44×44px on mobile
- Secondary buttons: ≥ 36×36px
- Icon-only buttons: ≥ 44×44px
- Spacing between tappable elements: ≥ 8px

### Testing

Before merging PRs, ensure:
- [ ] Stylelint passes (no hardcoded px in padding/margin)
- [ ] Manual test on iPhone (375px, 390px, 414px)
- [ ] Manual test on desktop (1280px, 1440px)
- [ ] Buttons are tappable without zooming
- [ ] Safe-area insets respected on iPhone (notch/home indicator)
```

---

### 9.3 Design System Documentation

**Create `docs/design-system-spacing.md`:**

```markdown
# ZeroMotion Design System: Spacing

## Spacing Scale (4pt/8pt Grid)

Our spacing system is based on a 4pt base unit, with common increments at 8pt intervals:

| Step | Token | Value | Px @ 16px | Usage |
|------|-------|-------|-----------|-------|
| 0 | `--space-0` | 0 | 0px | Reset |
| 1 | `--space-1` | 0.25rem | 4px | Icon spacing |
| 2 | `--space-2` | 0.5rem | 8px | Button icon gaps |
| 3 | `--space-3` | 0.75rem | 12px | Compact padding |
| 4 | `--space-4` | 1rem | 16px | Base unit |
| 5 | `--space-5` | 1.5rem | 24px | Card padding |
| 6 | `--space-6` | 2rem | 32px | Section padding |
| 7 | `--space-7` | 3rem | 48px | Large spacing |
| 8 | `--space-8` | 4rem | 64px | Section vertical |

## Fluid Spacing (Responsive)

Fluid tokens scale between mobile (360px) and desktop (1440px) using `clamp()`:

| Token | Mobile (360px) | Desktop (1440px) | Usage |
|-------|---------------|------------------|-------|
| `--space-fluid-sm` | 8px | 16px | Small responsive padding |
| `--space-fluid-md` | 16px | 24px | Medium responsive padding |
| `--space-fluid-lg` | 24px | 40px | Large responsive padding |
| `--space-fluid-xl` | 32px | 64px | Section padding |

## Component Spacing Patterns

### Buttons
- **Primary:** 44-54px height, 24-40px inline padding
- **Secondary:** 36-44px height, 16-28px inline padding
- **Icon-only:** 44×44px (square)

### Cards
- **Mobile:** 24px padding (`var(--space-5)`)
- **Desktop:** 24-40px fluid padding (`var(--space-fluid-lg)`)
- **Hover:** 6px translateY, 2% scale

### Sections
- **Vertical padding:** 48-96px fluid (`var(--space-fluid-2xl)`)
- **Horizontal padding:** Container-based (`var(--space-container-inline)`)

### Forms
- **Input height:** 44px minimum (mobile)
- **Field spacing:** 16-24px between fields
- **Submit button:** Primary button sizing

## Safe-Area Insets (iOS)

All sticky headers/footers must account for iPhone notch and home indicator:

```css
footer {
  padding-block-end: calc(var(--space-6) + var(--sa-bottom));
}
```

## Accessibility

- ✅ All tap targets ≥ 44×44px on mobile
- ✅ Adjacent elements ≥ 8px apart
- ✅ Focus states ≥ 3px outline
```

---

## 10. Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Visual regression (colors/fonts change)** | Low | High | Strict token isolation; visual diff testing; no color/font tokens touched |
| **Layout shift (CLS increase)** | Low | Moderate | Use `clamp()` with stable min/max; test on real devices; Lighthouse monitoring |
| **Button sizing breaks on edge cases** | Moderate | Moderate | Comprehensive viewport testing (360-1920px); Playwright assertions |
| **Safe-area insets not respected** | Low | Moderate | Manual iPhone testing; test on iPhone 14/15 with notch |
| **Performance regression** | Very Low | Low | Tokens are compiled; no runtime cost; Lighthouse comparison |
| **Developer adoption resistance** | Moderate | Low | Clear documentation; stylelint enforcement; code review checklist |
| **Merge conflicts during rollout** | High | Low | Phased rollout; feature branches; clear communication |
| **Old browsers don't support clamp()** | Low | Low | `clamp()` supported in all modern browsers (95%+ global support); graceful degradation |
| **Container queries not supported** | Low | Low | Progressive enhancement; fallback to media queries |
| **Touch devices have sticky hover states** | Moderate | Low | Use `@media (hover: none)` to disable hover on touch devices |

---

## 11. Success Metrics (30 Days Post-Launch)

| Metric | Baseline (Pre-Launch) | Target (Post-Launch) | Actual |
|--------|-----------------------|----------------------|--------|
| **Stylelint violations (px in padding)** | 467 | 0 | ___ |
| **WCAG 2.2 violations (tap targets)** | TBD | 0 | ___ |
| **Lighthouse CLS** | TBD | < 0.1 | ___ |
| **Lighthouse Performance** | TBD | ≥ 90 | ___ |
| **Lighthouse Accessibility** | TBD | 100 | ___ |
| **Mobile bounce rate** | TBD | ↓ 5% | ___ |
| **Form completion rate (mobile)** | TBD | ↑ 10% | ___ |
| **User complaints (spacing/usability)** | TBD | 0 | ___ |

---

## 12. Appendix: iOS Safe-Area Reference

### iPhone Safe-Area Inset Values (Typical)

| Device | Orientation | Top Inset | Bottom Inset | Left/Right Inset |
|--------|-------------|-----------|--------------|------------------|
| **iPhone SE (2022)** | Portrait | 20px | 0px | 0px |
| **iPhone 14** | Portrait | 47px | 34px | 0px |
| **iPhone 14 Pro** | Portrait | 59px | 34px | 0px |
| **iPhone 14 Pro Max** | Portrait | 59px | 34px | 0px |
| **iPhone 14** | Landscape | 0px | 21px | 47px |

**Source:** [WebKit Safe Area Insets](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

---

## 13. Contact & Feedback

**Document Owner:** [Your Name / Team]  
**Last Updated:** October 25, 2025  
**Version:** 1.0  

**Questions or Feedback?**  
- Slack: #zeromotion-dev  
- Email: dev@zeromotion.marketing  
- GitHub Issues: [Link to repo issues]

---

## 14. Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-25 | 1.0 | Initial document created |

---

**End of Document**

---

*This plan was created using research-backed best practices from CSS-Tricks, Smashing Magazine, web.dev, W3C WCAG 2.2, and WebKit documentation, combined with a detailed audit of the zeromotionmarketing.com codebase. All recommendations preserve the existing brand aesthetic while improving consistency, accessibility, and maintainability.*

