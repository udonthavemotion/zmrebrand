# Spacing Tokens Quick Reference Card

**Last Updated:** October 25, 2025  
**Version:** 2.0 (Enhanced System)

---

## Base Spacing Scale (8pt Grid)

| Token | Value | Pixels @ 16px | Common Usage |
|-------|-------|---------------|--------------|
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

---

## Fluid Spacing (Responsive)

| Token | Mobile (360px) | Desktop (1440px) | Common Usage |
|-------|----------------|------------------|--------------|
| `--space-fluid-xs` | 4px | 8px | Micro responsive spacing |
| `--space-fluid-sm` | 8px | 16px | Small responsive spacing |
| `--space-fluid-md` | 16px | 24px | Medium responsive spacing |
| `--space-fluid-lg` | 24px | 40px | Large responsive spacing |
| `--space-fluid-xl` | 32px | 64px | Extra-large responsive spacing |
| `--space-fluid-2xl` | 48px | 96px | Section vertical fluid spacing |

---

## Button Sizing (WCAG 2.2 Compliant)

| Token | Mobile | Desktop | Usage |
|-------|--------|---------|-------|
| `--size-button-primary` | 44px | 54px | Primary CTA buttons |
| `--size-button-secondary` | 36px | 44px | Secondary actions |
| `--size-button-icon` | 44px | 44px | Icon-only buttons (fixed) |
| `--padding-button-primary` | 24px | 40px | Primary button inline padding |
| `--padding-button-secondary` | 16px | 28px | Secondary button inline padding |

---

## Border Radius

| Token | Value | Pixels | Common Usage |
|-------|-------|--------|--------------|
| `--radius-xs` | 0.25rem | 4px | Small UI elements |
| `--radius-sm` | 0.5rem | 8px | Icons, badges |
| `--radius-md` | 0.75rem | 12px | Medium elements |
| `--radius-lg` | 1rem | 16px | Cards, panels |
| `--radius-xl` | 1.25rem | 20px | Large cards |
| `--radius-2xl` | 1.5rem | 24px | Buttons (primary) |
| `--radius-3xl` | 1.75rem | 28px | Hero buttons |
| `--radius-button` | var(--radius-2xl) | 24px | Default button radius |
| `--radius-button-hero` | var(--radius-3xl) | 28px | Hero button radius |
| `--radius-card` | var(--radius-xl) | 20px | Card radius |

---

## Semantic Tokens (Component-Specific)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-card-padding` | `var(--space-fluid-lg)` | Card inner padding (24-40px) |
| `--space-section-block` | `var(--space-fluid-2xl)` | Section vertical padding (48-96px) |
| `--space-container-inline` | `clamp(1.25rem, 3vw + 0.5rem, 1.5rem)` | Container horizontal padding (20-24px) |

---

## Utility Classes

```css
/* Padding */
.p-fluid-lg { padding: var(--space-fluid-lg); }
.p-inline-fluid-lg { padding-inline: var(--space-fluid-lg); }

/* Gap */
.gap-fluid-sm { gap: var(--space-fluid-sm); }

/* iOS Safe-Area */
.pad-safe-bottom {
  padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
}

/* WCAG Tap Target */
.tap-target {
  min-block-size: var(--size-button-icon);
  min-inline-size: var(--size-button-icon);
}
```

---

## Quick Examples

### Button Styling
```css
.btn {
  min-block-size: var(--size-button-primary);
  padding-inline: var(--padding-button-primary);
  padding-block: clamp(0.75rem, 1.5vw + 0.5rem, 1.125rem);
  gap: var(--space-2);
  border-radius: var(--radius-button);
}
```

### Card Styling
```css
.card {
  padding: var(--space-card-padding);
  border-radius: var(--radius-card);
}
```

### Section Spacing
```css
section {
  padding-block: var(--space-section-block);
  padding-inline: var(--space-container-inline);
}
```

### iOS Footer Safe-Area
```css
footer {
  padding-block-start: var(--space-6);
  padding-block-end: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}
```

---

## Common Patterns

### Flexbox Gap
```css
.flex-container {
  display: flex;
  gap: var(--space-4); /* 16px */
}
```

### Grid Gap
```css
.grid-container {
  display: grid;
  gap: var(--space-fluid-lg); /* 24-40px responsive */
}
```

### Form Field Spacing
```css
.form-field {
  margin-bottom: var(--space-5); /* 24px */
}
```

### Modal Padding
```css
.modal-header {
  padding: var(--space-5) var(--space-6); /* 24px 32px */
}
```

---

## DO's and DON'Ts

### ✅ DO:
```css
/* Use tokens */
padding: var(--space-4);
gap: var(--space-fluid-sm);
border-radius: var(--radius-button);

/* Use logical properties */
padding-inline: var(--space-6);
padding-block: var(--space-4);

/* Use fluid tokens for responsive */
padding: var(--space-fluid-lg);
```

### ❌ DON'T:
```css
/* Hardcoded px values */
padding: 20px;
gap: 12px;
border-radius: 24px;

/* Old-style properties */
padding-left: 32px;
padding-right: 32px;

/* Non-fluid hardcoded */
padding: 16px;
```

---

## Browser Support

✅ **CSS Variables:** 98%+ global support  
✅ **clamp():** 95%+ global support  
✅ **Logical Properties:** 96%+ global support  
✅ **env(safe-area-inset-*):** 95%+ mobile support  

All tokens gracefully degrade in unsupported browsers.

---

## Testing Checklist

When using spacing tokens, verify:

- [ ] Mobile (375px): Tap targets ≥ 44px
- [ ] Desktop (1280px+): Spacing scales appropriately
- [ ] iOS: Safe-area insets respected (notch/home indicator)
- [ ] DevTools: Computed values use CSS variables
- [ ] Hover states: Transforms smooth on mobile

---

## Need Help?

- **Full Guide:** See `SPACING_CONSISTENCY_PLAN.md`
- **Implementation Details:** See `SPACING_IMPLEMENTATION_COMPLETE.md`
- **Quick Start:** See `SPACING_QUICK_START.md`

---

**Tip:** Use browser DevTools to inspect computed values and verify tokens are being applied correctly!

