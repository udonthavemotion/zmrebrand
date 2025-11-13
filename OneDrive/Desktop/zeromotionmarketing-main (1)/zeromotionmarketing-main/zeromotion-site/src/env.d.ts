/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_FB_PIXEL_ID?: string;
  readonly PUBLIC_LINKEDIN_PARTNER_ID?: string;
  readonly PUBLIC_HOTJAR_ID?: string;
  readonly PUBLIC_CLARITY_ID?: string;
  readonly PUBLIC_GTM_SERVER_URL?: string;
  readonly PUBLIC_SENTRY_DSN?: string;
  readonly PUBLIC_VERCEL_GIT_COMMIT_SHA?: string;
  readonly SENTRY_DSN?: string;
  readonly NODE_ENV?: 'development' | 'production' | 'test';
  
  // ZRM CRM Configuration
  readonly PUBLIC_GHL_FORM_BASE?: string;
  readonly PUBLIC_GHL_FORM_ID?: string;
  readonly PUBLIC_GHL_CAL_BASE?: string;
  readonly PUBLIC_GHL_CALENDAR_ID?: string;
  readonly PUBLIC_GHL_CALENDAR_SCRIPT?: string;
  readonly PUBLIC_WIDGET_BASE?: string;

  // GHL Tracking Configuration
  readonly PUBLIC_GHL_TRACKING_SCRIPT_URL?: string;
  readonly PUBLIC_GHL_TRACKING_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type declarations
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'get' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[] & {
      push: (...args: any[]) => void;
    };
    ZMAnalytics?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
      trackPageView: (pagePath?: string) => void;
      trackFormSubmit: (formId: string, planType?: string) => void;
      trackConsultationBooking: (planType?: string) => void;
      trackButtonClick: (buttonText: string, buttonType: string, destination?: string) => void;
      trackVideoPlay: (videoSrc: string, duration?: number) => void;
      trackExternalLink: (url: string, linkText: string) => void;
      trackDownload: (fileName: string, fileType?: string) => void;
      trackPricingView: (planType: string) => void;
      trackScrollDepth: (percentage: number) => void;
    };
  }
}
