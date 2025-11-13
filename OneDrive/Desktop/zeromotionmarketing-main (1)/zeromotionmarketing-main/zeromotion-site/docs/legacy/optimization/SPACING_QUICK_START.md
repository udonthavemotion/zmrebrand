# Quick Start: Spacing System Implementation

**Goal:** Apply consistent spacing tokens across zeromotionmarketing.com for desktop and iPhone.

---

## Phase 1: Add Tokens (Day 1 - No UI Changes)

### 1. Add to `src/styles/global.css` (after line 24)

```css
/* ============================================
   ENHANCED SPACING TOKENS v2.0
   ============================================ */
:root {
  /* Complete spacing scale */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-7: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */

  /* Fluid spacing (responsive) */
  --space-fluid-sm: clamp(0.5rem, 1vw + 0.25rem, 1rem);
  --space-fluid-md: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  --space-fluid-lg: clamp(1.5rem, 3vw + 0.75rem, 2.5rem);
  --space-fluid-xl: clamp(2rem, 4vw + 1rem, 4rem);
  --space-fluid-2xl: clamp(3rem, 5vw + 1.5rem, 6rem);

  /* Button sizing (WCAG 2.2 compliant) */
  --size-button-primary: clamp(2.75rem, 3vw + 2rem, 3.375rem);
  --size-button-secondary: clamp(2.25rem, 2.5vw + 1.75rem, 2.75rem);
  --size-button-icon: 2.75rem; /* 44px */
  --padding-button-primary: clamp(1.5rem, 2vw + 1rem, 2.5rem);
  --padding-button-secondary: clamp(1rem, 1.5vw + 0.75rem, 1.75rem);

  /* Border radius */
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
  --radius-2xl: 1.5rem;
  --radius-3xl: 1.75rem;
  --radius-button: var(--radius-2xl);
  --radius-button-hero: var(--radius-3xl);
  --radius-card: var(--radius-xl);

  /* Semantic tokens */
  --space-card-padding: var(--space-fluid-lg);
  --space-section-block: var(--space-fluid-2xl);
  --space-container-inline: clamp(1.25rem, 3vw + 0.5rem, 1.5rem);
}

/* Utility classes */
.p-fluid-lg { padding: var(--space-fluid-lg); }
.p-inline-fluid-lg { padding-inline: var(--space-fluid-lg); }
.gap-fluid-sm { gap: var(--space-fluid-sm); }

.pad-safe-bottom {
  padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
}

.tap-target {
  min-block-size: var(--size-button-icon);
  min-inline-size: var(--size-button-icon);
}
```

### 2. Test (No Visual Changes Expected)
```bash
npm run dev
# Open localhost in browser
# Verify no console errors
# Visual check: everything should look identical
```

---

## Phase 2: Refactor Buttons (Day 2-3)

### 1. Replace Button Styles in `global.css` (line ~962)

**Find:**
```css
.btn {
  display: inline-flex;
  padding: 18px 36px;
  min-height: 54px;
  /* ... */
}
```

**Replace with:**
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-block-size: var(--size-button-primary);
  padding-inline: var(--padding-button-primary);
  padding-block: clamp(0.75rem, 1.5vw + 0.5rem, 1.125rem);
  gap: var(--space-2);
  font-size: clamp(0.875rem, 1vw + 0.75rem, 1rem);
  font-weight: 600;
  border-radius: var(--radius-button);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary { /* keep existing styles */ }
.btn-secondary { /* keep existing styles */ }

/* Icon-only buttons */
.btn-icon {
  min-block-size: var(--size-button-icon);
  min-inline-size: var(--size-button-icon);
  padding: var(--space-2);
  border-radius: var(--radius-lg);
}

/* Hero buttons */
.hero-content .btn-primary {
  min-block-size: clamp(2.875rem, 3.5vw + 2rem, 3.5rem);
  padding-inline: clamp(2rem, 3vw + 1.5rem, 3rem);
  border-radius: var(--radius-button-hero);
}
```

### 2. Test on All Pages
```bash
# Desktop: 1280px, 1440px
# Mobile: 375px, 390px, 414px
# Check: All buttons ≥ 44x44px on mobile
```

---

## Phase 3: Refactor Cards (Day 4-5)

### 1. Update Card Styles in `global.css` (line ~760)

**Find:**
```css
.pkg {
  padding: 30px;
  border-radius: 20px;
  /* ... */
}
```

**Replace with:**
```css
.card,
.pkg {
  padding: var(--space-card-padding);
  border-radius: var(--radius-card);
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(139, 92, 246, 0.3);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover,
.pkg:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(139, 92, 246, 0.8);
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 20px 50px rgba(139, 92, 246, 0.3),
    0 8px 25px rgba(139, 92, 246, 0.2);
}

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
```

---

## Phase 4: Footer & iOS Safe-Area (Day 6)

### 1. Update Footer in `Footer.astro` (line ~6)

**Find:**
```astro
<footer class="relative py-1 ...">
```

**Replace with:**
```astro
<footer class="relative pad-safe-bottom ...">
```

**Add CSS:**
```css
footer {
  padding-block-start: var(--space-6);
  padding-block-end: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
  padding-inline: var(--space-container-inline);
}
```

### 2. Test on iPhone
- Open site on iPhone 14/15
- Scroll to bottom
- Verify content not obscured by home indicator

---

## Quick Checks After Each Phase

### ✅ Phase 1 Checklist
- [ ] No console errors
- [ ] Site looks identical
- [ ] Tokens show in DevTools computed styles

### ✅ Phase 2 Checklist
- [ ] All buttons ≥ 44px on mobile (measure in DevTools)
- [ ] Button padding consistent across pages
- [ ] Hero buttons slightly larger (correct)
- [ ] Nav buttons match brand standards

### ✅ Phase 3 Checklist
- [ ] All cards have consistent padding
- [ ] Card hover effects smooth
- [ ] Mobile: cards readable, not cramped

### ✅ Phase 4 Checklist
- [ ] iPhone: footer not obscured by home indicator
- [ ] Desktop: footer looks unchanged

---

## Testing Commands

```bash
# Run dev server
npm run dev

# Run linter (check for hardcoded px)
npx stylelint "src/**/*.css" --config stylelint-spacing.config.js

# Run Playwright tests (if set up)
npx playwright test tests/spacing-consistency.spec.ts

# Build production
npm run build
npm run preview
```

---

## Rollback If Needed

```bash
# Revert specific file
git checkout HEAD -- src/styles/global.css

# Revert entire branch
git reset --hard origin/main
```

---

## Developer Guidelines

### ✅ DO:
```css
/* Use tokens */
padding: var(--space-4);
gap: var(--space-fluid-sm);
border-radius: var(--radius-button);
```

### ❌ DON'T:
```css
/* Hardcoded px (bad!) */
padding: 20px;
gap: 12px;
border-radius: 24px;
```

---

## Support

**Questions?**
- See full plan: `docs/SPACING_CONSISTENCY_PLAN.md`
- Slack: #zeromotion-dev
- Issues: GitHub repo

---

**Next Steps:**
1. Review full plan (`SPACING_CONSISTENCY_PLAN.md`)
2. Run Phase 1 (tokens only)
3. Test thoroughly before Phase 2
4. Proceed incrementally, test at each phase

