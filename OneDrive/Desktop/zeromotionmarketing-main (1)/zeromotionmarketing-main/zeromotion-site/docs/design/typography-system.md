# Zero Motion Typography System

## Quick Reference

### Core Typography

#### Headings (H1-H6)
```css
/* Improved readability and hierarchy */
.h1 { line-height: 1.15; font-weight: 700; letter-spacing: -0.025em; }
.h2 { line-height: 1.25; font-weight: 650; letter-spacing: -0.02em; }
.h3 { line-height: 1.35; font-weight: 600; letter-spacing: -0.015em; }
.h4 { line-height: 1.4; font-weight: 600; letter-spacing: -0.01em; }
.h5 { line-height: 1.45; font-weight: 600; letter-spacing: -0.005em; }
.h6 { line-height: 1.5; font-weight: 600; letter-spacing: 0; }
```

**Impact**: Better readability, no clipping, clear visual hierarchy

#### Body Text
```css
p, .body-text {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.01em;
  margin-bottom: 1.25em;
}
```

### Buttons & CTAs

#### Primary Button
```css
/* Subtle, refined interactions */
border: 1px solid transparent;
transform: translateY(-2px) scale(1.008);
letter-spacing: 0.015em;
line-height: 1.2;
box-shadow:
  0 6px 24px rgba(139, 92, 246, 0.35),
  0 3px 12px rgba(139, 92, 246, 0.2),
  0 1px 3px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

### Cards & Containers

#### Card Styling
```css
/* Refined, modern appearance */
border: 1px solid rgba(139, 92, 246, 0.2);
border-radius: 20px;
box-shadow:
  0 4px 16px rgba(0, 0, 0, 0.3),
  0 2px 8px rgba(0, 0, 0, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

### Mobile Optimization

#### Mobile Typography
```css
@media (max-width: 480px) {
  .h1 { line-height: 1.25; }
  .h2 { line-height: 1.35; }
  .h3 { line-height: 1.45; }
  p { line-height: 1.65; }
}
```

---

## Complete Implementation Details

### 1. Typography Improvements

#### Text Shadows (Depth & Dimension)
- **H1**: `0 2px 8px rgba(0, 0, 0, 0.3)`
- **H2**: `0 1px 6px rgba(0, 0, 0, 0.25)`
- **H3**: `0 1px 4px rgba(0, 0, 0, 0.2)`

#### Lead Paragraph Style
```css
.lead {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  font-weight: 400;
  line-height: 1.65;
  letter-spacing: 0.005em;
  color: var(--zm-text-secondary);
}
```

### 2. Form Input Styling

#### Base Input Styles
```css
input, textarea, select {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 0.75rem 1rem;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

#### Focus States
```css
input:focus {
  border-color: var(--zm-primary);
  box-shadow:
    0 0 0 3px rgba(139, 92, 246, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.2);
}
```

### 3. Link Styling

#### Content Links (in paragraphs/lists)
```css
p a, li a {
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: rgba(139, 92, 246, 0.3);
  text-underline-offset: 2px;
}
```

### 4. Spacing & Layout

#### Section Title Utilities
```css
.section-title {
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.section-subtitle {
  margin-top: 0.75rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}
```

#### Content Flow
```html
<div class="content-flow">
  <p>Paragraph with automatic spacing</p>
  <h3>Heading with smart spacing</h3>
  <p>Another paragraph</p>
</div>
<!-- Automatic spacing between all elements -->
```

---

## Shadow Design Philosophy

### Multi-Layer Shadow System
All major components use a 3-4 layer shadow approach:

1. **Primary shadow**: Main depth (largest blur, moderate opacity)
2. **Secondary shadow**: Mid-range definition (medium blur, lighter)
3. **Ground shadow**: Contact point (small blur, dark)
4. **Inset highlight**: Top edge light reflection

---

## Visual Comparison Table

| Element | Before | After | Why |
|---------|--------|-------|-----|
| H1 Line Height | 0.95 | 1.15 | Prevent clipping |
| H1 Font Weight | 600 | 700 | Stronger hierarchy |
| Card Border | 2px | 1px | Modern aesthetic |
| Card Border Radius | 16px | 20px | Softer, contemporary |
| Button Border | 2px | 1px | Refined appearance |
| Button Scale | 1.02 | 1.008 | Subtle interaction |
| Shadow Layers | 1-2 | 3-4 | Enhanced depth |
| Body Line Height | undefined | 1.7 | Better readability |

---

## Performance Notes

- Reduced transforms - Better mobile performance
- Optimized shadows - Lower GPU load
- Maintained will-change - Smooth animations
- No breaking changes - Backwards compatible

---

## Testing Checklist

- [ ] Check all heading levels render correctly
- [ ] Verify button hover states across site
- [ ] Test card hover effects on pricing page
- [ ] Validate form input styling
- [ ] Confirm mobile typography on phone
- [ ] Check link visibility in content areas
- [ ] Verify badge styling on popular plans

---

**Files Modified**: `/zeromotion-site/src/styles/global.css`
**Implementation Date**: October 26, 2025
**Status**: Complete
