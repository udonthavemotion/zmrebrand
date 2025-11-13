# Vercel Environment Variables Setup Guide

## 🚨 CRITICAL: Required Environment Variables for Production

These environment variables **MUST** be configured in your Vercel dashboard for the site to work properly in production.

### How to Add Environment Variables in Vercel:

1. Go to your Vercel Dashboard
2. Select your project (`zeromotion-site`)
3. Click on **Settings** → **Environment Variables**
4. Add each variable below

---

## GoHighLevel Configuration (REQUIRED)

These variables control your booking forms and calendar integrations. **Without these, forms will not display on production.**

```bash
# GoHighLevel Form Configuration
PUBLIC_GHL_FORM_BASE=https://dashboard.zeromotionmarketing.com
PUBLIC_GHL_FORM_ID=n9og5xkVVmjupqiLT2R6

# GoHighLevel Calendar Configuration
PUBLIC_GHL_CAL_BASE=https://link.zeromotionmarketing.com
PUBLIC_GHL_CALENDAR_ID=fr87zeXsZz80Eg05tQEV
PUBLIC_GHL_CALENDAR_SCRIPT=/js/booking_embed.js

# Widget Base URL
PUBLIC_WIDGET_BASE=https://link.zeromotionmarketing.com

# GoHighLevel Tracking Configuration
PUBLIC_GHL_TRACKING_SCRIPT_URL=https://dashboard.zeromotionmarketing.com/js/external-tracking.js
PUBLIC_GHL_TRACKING_ID=tk_b796b959ba314fcbbf49193f09be11da
```

**Important:** Make sure to select **Production**, **Preview**, and **Development** for each variable's environment scope.

---

## Analytics Configuration (Optional)

```bash
# Google Tag Manager
PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4
PUBLIC_GA4_ID=G-XXXXXXXXXX

# Facebook Pixel
PUBLIC_FB_PIXEL_ID=

# LinkedIn Partner ID
PUBLIC_LINKEDIN_PARTNER_ID=

# Hotjar Site ID
PUBLIC_HOTJAR_ID=

# Microsoft Clarity ID
PUBLIC_CLARITY_ID=

# GTM Server URL (if using server-side GTM)
PUBLIC_GTM_SERVER_URL=
```

---

## Error Tracking (Optional but Recommended)

```bash
# Sentry Error Tracking
PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## Environment Variable

```bash
NODE_ENV=production
```

---

## Verification Checklist

After adding environment variables to Vercel:

- [ ] All `PUBLIC_GHL_*` variables are set
- [ ] Variables are enabled for Production, Preview, and Development
- [ ] Redeploy triggered (automatic after saving env vars)
- [ ] Check deployment logs for any env variable warnings
- [ ] Visit your production site and test:
  - [ ] Booking modal opens
  - [ ] Calendar widget loads inside modal
  - [ ] Images and videos display
  - [ ] Background videos play

---

## Common Issues & Solutions

### Issue: Forms not displaying
**Solution:** Verify all `PUBLIC_GHL_*` variables are set in Vercel dashboard

### Issue: CSP blocking resources
**Solution:** Already configured in `vercel.json` - CSP allows GoHighLevel domains

### Issue: Images/videos not loading
**Solution:** 
- Check public folder structure
- Verify assets are committed to git
- Check browser console for 404 errors
- Ensure `Cross-Origin-Resource-Policy` is set to `cross-origin`

### Issue: Changes not reflecting
**Solution:** 
- Trigger a manual redeploy in Vercel
- Clear browser cache
- Check deployment logs for build errors

---

## Local Development Setup

For local development, create a `.env` file in the `zeromotion-site` directory:

```bash
# Copy these values
PUBLIC_GHL_FORM_BASE=https://dashboard.zeromotionmarketing.com
PUBLIC_GHL_FORM_ID=n9og5xkVVmjupqiLT2R6
PUBLIC_GHL_CAL_BASE=https://link.zeromotionmarketing.com
PUBLIC_GHL_CALENDAR_ID=fr87zeXsZz80Eg05tQEV
PUBLIC_WIDGET_BASE=https://link.zeromotionmarketing.com
PUBLIC_GHL_TRACKING_SCRIPT_URL=https://dashboard.zeromotionmarketing.com/js/external-tracking.js
PUBLIC_GHL_TRACKING_ID=tk_b796b959ba314fcbbf49193f09be11da
NODE_ENV=development
```

**Note:** The `.env` file is gitignored for security. Never commit it to version control.

---

## Testing After Deployment

1. **Open Production Site**: Visit `https://www.zeromotionmarketing.com`
2. **Test Booking Modal**: Click any "Book Free Consultation" button
3. **Verify Calendar**: Ensure GoHighLevel calendar widget appears
4. **Check Media**: Scroll through pages to verify images/videos load
5. **Browser Console**: Check for CSP or CORS errors (there should be none)
6. **Mobile Test**: Test on mobile device for responsive behavior

---

## Need Help?

If issues persist after following this guide:
1. Check Vercel deployment logs
2. Inspect browser console for errors
3. Verify environment variables are actually set in Vercel
4. Ensure latest commit is deployed

