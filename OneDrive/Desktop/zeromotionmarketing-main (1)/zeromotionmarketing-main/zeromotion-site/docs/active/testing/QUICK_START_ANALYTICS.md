# 🚀 Quick Start: ZeroMotion Analytics Setup

## 1. Environment Variables

Create a `.env` file in your project root with your tracking IDs:

```env
# Required
PUBLIC_GTM_ID=GTM-XXXXXXX
PUBLIC_GA4_ID=G-XXXXXXXXXX

# Optional but recommended
PUBLIC_FB_PIXEL_ID=1234567890123456
PUBLIC_LINKEDIN_PARTNER_ID=123456
PUBLIC_HOTJAR_ID=1234567
PUBLIC_CLARITY_ID=abcdefghij

# Advanced (iOS14+ compatibility)
PUBLIC_GTM_SERVER_URL=https://your-server-container.com
```

## 2. GTM Container Setup

### Create Tags:
1. **GA4 Configuration**
   - Tag Type: GA4 Configuration
   - Measurement ID: `{{GA4 Measurement ID}}`
   - Trigger: All Pages

2. **Facebook Pixel**
   - Tag Type: Custom HTML
   - HTML: Facebook Pixel base code
   - Trigger: All Pages

3. **LinkedIn Insight Tag**
   - Tag Type: Custom HTML  
   - HTML: LinkedIn tracking code
   - Trigger: All Pages

### Create Triggers:
- **Form Submit**: Form submission events
- **Button Click**: Click events on buttons/CTAs
- **Video Engagement**: Video play/progress events
- **Scroll Depth**: 25%, 50%, 75%, 90% milestones
- **File Download**: PDF/document downloads

### Create Variables:
- **GA4 Measurement ID**: `{{GA4 Measurement ID}}`
- **Facebook Pixel ID**: `{{Facebook Pixel ID}}`
- **LinkedIn Partner ID**: `{{LinkedIn Partner ID}}`

## 3. GA4 Configuration

### Enable Enhanced Measurement:
- Page views ✅
- Scrolls ✅  
- Outbound clicks ✅
- Site search ❌ (handled custom)
- Video engagement ✅
- File downloads ✅

### Set Up Conversions:
1. Go to GA4 > Configure > Events
2. Mark these as conversions:
   - `consultation_booking`
   - `form_submit`
   - `pricing_view`
   - `file_download`

### Create Audiences:
- **High Intent Users**: Visited pricing + watched video
- **Form Abandoners**: Started form but didn't submit
- **Video Watchers**: Watched >50% of any video

## 4. Testing Checklist

### Development Testing:
- [ ] Analytics debugger appears (dev environments only)
- [ ] Cookie consent banner shows for new visitors
- [ ] GTM container loads without errors
- [ ] Console shows tracking events

### Production Testing:
- [ ] GTM Preview mode shows all tags firing
- [ ] GA4 DebugView shows real-time events
- [ ] Facebook Pixel Helper confirms tracking
- [ ] Forms submit successfully with tracking
- [ ] Video play events fire correctly
- [ ] Scroll depth events trigger
- [ ] UTM parameters are captured

## 5. Privacy Compliance

### Cookie Consent:
- Shows automatically for new visitors
- Granular consent options available
- Analytics respect consent choices
- Easy opt-out mechanism

### GDPR Features:
- IP anonymization enabled
- Data retention policies configured
- Right to be forgotten support
- Transparent data usage explanations

## 6. Monitoring & Maintenance

### Daily:
- Monitor real-time analytics for issues
- Check conversion tracking accuracy

### Weekly:
- Review cookie consent rates
- Analyze conversion funnel performance
- Check for tracking errors

### Monthly:
- Audit analytics implementation
- Update conversion goals as needed
- Review privacy compliance

## 7. Troubleshooting

### Common Issues:

**Events not firing?**
- Check browser console for errors
- Verify GTM container is published
- Ensure environment variables are set

**Cookie consent not working?**
- Clear browser cookies and test
- Check localStorage for consent data
- Verify consent modal functionality

**Server-side tracking issues?**
- Confirm GTM server container setup
- Check server-side endpoint configuration
- Verify cross-domain tracking

### Debug Commands:
```javascript
// Check analytics status
console.table(window.ZMAnalytics);

// Test event tracking  
window.ZMAnalytics.track('test_event', { test: true });

// View cookie consent
console.log(localStorage.getItem('zm-cookie-consent'));

// Test server-side tracking
window.ZMServerTracking?.sendEvent('test', {});
```

## 8. Performance Impact

### Optimizations Included:
- Async script loading
- DNS prefetch for tracking domains
- Conditional loading based on consent
- Event throttling for performance
- Resource cleanup and memory management

### Expected Impact:
- **Page Load**: <100ms additional load time
- **First Paint**: No impact (scripts load async)
- **Core Web Vitals**: Minimal impact with optimizations

---

🎯 **Ready to Go!** Your analytics setup is comprehensive, privacy-compliant, and performance-optimized. Monitor the first few days closely to ensure everything is working as expected.

