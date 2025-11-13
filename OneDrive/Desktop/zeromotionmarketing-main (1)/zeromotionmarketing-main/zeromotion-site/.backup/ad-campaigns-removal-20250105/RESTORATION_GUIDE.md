# Ad Campaigns Page Restoration Guide

## Overview
This guide explains how to restore the ad campaigns page that was temporarily removed on January 5, 2025.

## Files Backed Up
- `ad-campaigns.astro` - Main ad campaigns page
- `ad-campaigns-media/` - Service subdirectory with components

## What Was Removed

### 1. Navigation References
- **Services.astro**: Removed "Ad Campaigns & Media" service card
- **Navbar.astro**: Removed desktop and mobile navigation links to `/ad-campaigns`

### 2. Configuration Files
- **sitemap.xml**: Removed sitemap entry for `/ad-campaigns`
- **vercel.json**: Removed cache headers configuration for `/ad-campaigns` route

### 3. 404 Page
- **404.astro**: Removed link to `/services/ad-campaigns-media` and related tracking

### 4. Page Files
- **src/pages/ad-campaigns.astro**: Main page file (deleted)
- **src/pages/services/ad-campaigns-media/**: Entire directory (deleted)

## Restoration Steps

### 1. Restore Page Files
```bash
# Copy back the main page
cp .backup/ad-campaigns-removal-20250105/ad-campaigns.astro src/pages/

# Copy back the service directory if it exists
cp -r .backup/ad-campaigns-removal-20250105/ad-campaigns-media src/pages/services/
```

### 2. Restore Navigation (Services.astro)
Add back to the services array (around line 27):
```javascript
{
  title: "Ad Campaigns & Media",
  blurb: "We don't just run ads—we work with you to tell your story in a way that connects. Each campaign is backed by research, powered by AI insights, and shaped around your audience so every dollar brings real results.",
  img: "/photos/ad-campaigns.jpg",
  video: "/photos/ad-campaigns.mp4",
  href: "/ad-campaigns",
},
```

### 3. Restore Navbar Links (Navbar.astro)
Add back to desktop dropdown (around line 86):
```html
<li>
  <a
    href="/ad-campaigns"
    class="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white dd-item transition-colors duration-200"
    role="menuitem"
    tabindex="-1">Ad Campaigns &amp; Media</a>
</li>
```

Add back to mobile dropdown (around line 237):
```html
<a
  href="/ad-campaigns"
  class={`mobile-nav-subitem block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
    Astro.url.pathname === '/services/ad-campaigns'
      ? 'text-white bg-white/10'
      : 'text-white/70 hover:text-white hover:bg-white/5'
  }`}
  role="menuitem"
  aria-current={Astro.url.pathname === '/services/ad-campaigns' ? "page" : undefined}
>
  Ad Campaigns & Media
</a>
```

### 4. Restore Sitemap Entry (sitemap.xml)
Add back after About section (around line 32):
```xml
<!-- Ad Campaigns -->
<url>
  <loc>https://zeromotion.marketing/ad-campaigns</loc>
  <lastmod>2024-12-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 5. Restore Vercel Configuration (vercel.json)
Add back after plans section (around line 75):
```json
{
  "source": "/ad-campaigns",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400" }
  ]
},
```

### 6. Restore 404 Page References (404.astro)
Add back service link (around line 108):
```html
<a
  href="/services/ad-campaigns-media"
  class="flex items-center gap-3 p-4 bg-surface/50 hover:bg-surface/70 rounded-lg transition-all duration-300 group"
  data-track="404-ad-campaigns-click"
>
  <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
  </div>
  <div class="text-left">
    <div class="font-semibold text-white">Ad Campaigns</div>
    <div class="text-sm text-text-muted">Media & advertising</div>
  </div>
</a>
```

Add back tracking code (around line 182):
```javascript
trackClicks('[data-track="404-ad-campaigns-click"]', 'ad_campaigns_link');
```

### 7. Test After Restoration
```bash
npm run build
npm run dev
```

## Notes
- The removal was clean with no broken references left behind
- All functionality has been preserved in backup
- The website builds successfully without the ad campaigns page
- Media files and assets remain untouched
