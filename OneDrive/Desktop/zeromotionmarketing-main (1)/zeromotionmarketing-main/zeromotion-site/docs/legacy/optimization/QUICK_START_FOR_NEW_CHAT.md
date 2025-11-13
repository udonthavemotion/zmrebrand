# 🚀 Quick Start - New Agent Instructions

**Copy and paste this into your new chat with an AI agent (Claude, ChatGPT, etc.):**

---

## Prompt for New Agent:

```
I need you to optimize my ZeroMotion marketing website for performance and conversion. 

I have complete documentation in the docs/ folder:

1. Read: zeromotion-site/docs/AGENT_OPTIMIZATION_BRIEF.md
2. Use: zeromotion-site/docs/OPTIMIZATION_TASKS_CHECKLIST.md

Project Directory: zeromotion-site/

CRITICAL RULES:
- DO NOT change our custom design, backgrounds, or media files
- DO NOT break GoHighLevel (GHL) form/calendar integration
- DO NOT change site structure or layout
- ENHANCE and OPTIMIZE existing code, don't rebuild

GOALS:
- Lighthouse score 90+ (mobile & desktop)
- Add lead magnet section (funnel audit PDF)
- Add trust/testimonial section
- Optimize all images to WebP/AVIF
- Reduce JS bundle size
- Add mobile sticky CTA bar

Start by reading the AGENT_OPTIMIZATION_BRIEF.md file, then work through the checklist.

Ready to begin?
```

---

## What the Agent Will Do:

### Phase 1: Conversion Wins (2-3 hours)
- ✅ Enhance hero CTA for better conversion
- ✅ Create lead magnet section with GHL form
- ✅ Add mobile sticky CTA bar
- ✅ Create trust section with client logos

### Phase 2: Performance (2-3 hours)
- ✅ Convert 51 PNGs + 24 JPGs to WebP/AVIF
- ✅ Reduce JavaScript bundle from 440KB to <300KB
- ✅ Optimize lazy loading
- ✅ Fix any layout shift issues

### Phase 3: Polish (1-2 hours)
- ✅ SEO enhancements (meta tags, alt text, headings)
- ✅ Testing (GHL forms, mobile, desktop)
- ✅ Performance audit (Lighthouse)
- ✅ Final validation

---

## Total Estimated Time: 6-8 hours

---

## Files Created for the Agent:

1. **AGENT_OPTIMIZATION_BRIEF.md** - Complete technical specification (15,000+ words)
2. **OPTIMIZATION_TASKS_CHECKLIST.md** - Task-by-task checklist with checkboxes
3. **README_OPTIMIZATION_PROJECT.md** - Project overview and quick reference

---

## Expected Deliverables:

### New Components:
- `src/components/LeadMagnetSection.astro`
- `src/components/TrustSection.astro`
- `src/components/MobileStickyCTA.astro`

### Modified Files:
- `src/components/Hero.astro` (enhanced CTA)
- `src/pages/index.astro` (new sections added)
- `src/layouts/BaseLayout.astro` (script optimizations)
- All image files (converted to WebP/AVIF)

### Performance Report:
- Before/after Lighthouse scores
- Bundle size comparison
- Load time improvements
- Image optimization results

---

## Success Criteria:

✅ Lighthouse Mobile Score ≥ 90
✅ Lighthouse Desktop Score ≥ 90
✅ All GHL forms working
✅ No console errors
✅ No layout shift
✅ Mobile tested
✅ Desktop tested

---

## After Completion:

The agent should provide:
1. Summary of changes made
2. Performance improvement metrics
3. Test results (Lighthouse scores)
4. Any issues encountered
5. Recommendations for future improvements

---

**That's it! The agent has everything needed to complete the optimization.** 🎯

