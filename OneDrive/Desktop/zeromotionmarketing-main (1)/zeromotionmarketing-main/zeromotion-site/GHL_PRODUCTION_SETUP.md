# GoHighLevel Production Setup Guide

## Issues Identified & Fixed

### 1. Content Security Policy (CSP) Issues ✅ FIXED
- **Problem**: CSP headers in `vercel.json` were blocking your custom GHL domain
- **Solution**: Added `https://link.zeromotionmarketing.com` to all relevant CSP directives

### 2. JavaScript Syntax Error ✅ ALREADY FIXED
- **Problem**: Missing `if` condition in `GHLForm.astro` 
- **Solution**: Code was already correct in current version

### 3. Inconsistent Domain Usage ✅ FIXED
- **Problem**: Mixed usage of `link.gohighlevel.com` and `link.zeromotionmarketing.com`
- **Solution**: Updated GHLForm.astro to use your custom domain consistently

## Current GHL Configuration Found

Your site uses these GHL resources:

### Forms:
- **Contact Form**: `vSs75oKjAPcQGOAT8xOK` (Contact.astro)
- **CRM Registration**: `dCqTfq2owsS91i1E73EZ` (CRMRegistrationCTA.astro, StrategistModal.astro)

### Calendar:
- **Booking Widget**: `fr87zeXsZz80Eg05tQEV` (ModernBookingModal.astro)

### Custom Domain:
- **Your GHL Domain**: `link.zeromotionmarketing.com`

## Deployment Steps Required

### 1. Redeploy Your Site
After the CSP and script fixes, you need to redeploy:
```bash
npm run build
# Deploy to Vercel
```

### 2. Verify GHL Domain Configuration
In your GoHighLevel account, ensure:
- Custom domain `link.zeromotionmarketing.com` is properly configured
- SSL certificate is valid for your custom domain
- All form and calendar widgets are published and active

### 3. Test Each Component
After deployment, test these pages:
- Contact forms on service pages
- CRM registration modal (should pop up)
- Booking calendar modal
- Check browser console for any remaining errors

## Why It Works Locally But Not in Production

1. **Development vs Production CSP**: Local dev doesn't enforce CSP headers
2. **Script Loading**: Production has stricter security policies
3. **Domain Resolution**: Your custom GHL domain needs proper DNS/SSL setup
4. **Caching**: Browser/CDN caching might serve old broken versions

## If Issues Persist

### Check Browser Console
Look for these errors:
- CSP violations
- Failed script loads
- CORS errors

### Verify GHL Setup
1. Test your widgets directly: `https://link.zeromotionmarketing.com/widget/form/[FORM_ID]`
2. Check GHL dashboard for widget status
3. Verify custom domain SSL certificate

### Fallback Options
The GHLForm component includes fallback contact info if scripts fail to load.

## Environment Variables (Optional Enhancement)

Consider adding these to Vercel environment variables for better configuration:
```
PUBLIC_GHL_DOMAIN=link.zeromotionmarketing.com
PUBLIC_GHL_CONTACT_FORM_ID=vSs75oKjAPcQGOAT8xOK
PUBLIC_GHL_CRM_FORM_ID=dCqTfq2owsS91i1E73EZ  
PUBLIC_GHL_BOOKING_WIDGET_ID=fr87zeXsZz80Eg05tQEV
```
