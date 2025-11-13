/// <reference path="../env.d.ts" />

/**
 * Language Support and Internationalization Utilities
 * Provides language detection, locale management, and i18n support
 */

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export interface TranslationStrings {
  [key: string]: {
    [locale: string]: string;
  };
}

// Supported languages configuration
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', direction: 'ltr', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', direction: 'ltr', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', direction: 'ltr', flag: '🇸🇰' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', direction: 'ltr', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', direction: 'ltr', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', direction: 'ltr', flag: '🇭🇷' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', direction: 'ltr', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', direction: 'ltr', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', direction: 'ltr', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', direction: 'ltr', flag: '🇱🇹' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', direction: 'ltr', flag: '🇲🇹' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', flag: '🇬🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷' }
];

// Basic translations for common UI elements
export const COMMON_TRANSLATIONS: TranslationStrings = {
  'contact_us': {
    'en': 'Contact Us',
    'es': 'Contáctanos',
    'fr': 'Contactez-nous',
    'de': 'Kontaktieren Sie uns',
    'pt': 'Entre em contato',
    'it': 'Contattaci',
    'nl': 'Neem contact op',
    'ar': 'اتصل بنا',
    'zh': '联系我们',
    'ja': 'お問い合わせ',
    'ko': '문의하기'
  },
  'get_started': {
    'en': 'Get Started',
    'es': 'Comenzar',
    'fr': 'Commencer',
    'de': 'Loslegen',
    'pt': 'Começar',
    'it': 'Inizia',
    'nl': 'Aan de slag',
    'ar': 'ابدأ',
    'zh': '开始',
    'ja': '始める',
    'ko': '시작하기'
  },
  'learn_more': {
    'en': 'Learn More',
    'es': 'Saber Más',
    'fr': 'En Savoir Plus',
    'de': 'Mehr Erfahren',
    'pt': 'Saiba Mais',
    'it': 'Scopri di Più',
    'nl': 'Meer Weten',
    'ar': 'اعرف المزيد',
    'zh': '了解更多',
    'ja': 'もっと知る',
    'ko': '더 알아보기'
  },
  'services': {
    'en': 'Services',
    'es': 'Servicios',
    'fr': 'Services',
    'de': 'Dienstleistungen',
    'pt': 'Serviços',
    'it': 'Servizi',
    'nl': 'Diensten',
    'ar': 'الخدمات',
    'zh': '服务',
    'ja': 'サービス',
    'ko': '서비스'
  },
  'pricing': {
    'en': 'Pricing',
    'es': 'Precios',
    'fr': 'Tarifs',
    'de': 'Preise',
    'pt': 'Preços',
    'it': 'Prezzi',
    'nl': 'Prijzen',
    'ar': 'الأسعار',
    'zh': '定价',
    'ja': '料金',
    'ko': '가격'
  }
};

class LanguageManager {
  private static instance: LanguageManager;
  private currentLanguage: LanguageConfig;
  private translations: TranslationStrings = COMMON_TRANSLATIONS;

  private constructor() {
    this.currentLanguage = this.detectLanguage();
    this.applyLanguageAttributes();
  }

  static getInstance(): LanguageManager {
    if (!LanguageManager.instance) {
      LanguageManager.instance = new LanguageManager();
    }
    return LanguageManager.instance;
  }

  /**
   * Detect user's preferred language
   */
  private detectLanguage(): LanguageConfig {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    if (langParam) {
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === langParam);
      if (lang) return lang;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem('zm-language');
      if (stored) {
        const lang = SUPPORTED_LANGUAGES.find(l => l.code === stored);
        if (lang) return lang;
      }
    } catch (error) {
      console.warn('Could not read language preference from localStorage');
    }

    // Check browser language
    const browserLangs = navigator.languages || [navigator.language];

    for (const lang of browserLangs) {
      const langCode = lang.split('-')[0];
      const supported = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
      if (supported) return supported;
    }

    // Default to English
    return SUPPORTED_LANGUAGES[0];
  }

  /**
   * Set the current language
   */
  setLanguage(languageCode: string): void {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!language) {
      console.warn(`Language ${languageCode} not supported`);
      return;
    }

    this.currentLanguage = language;

    // Store preference
    try {
      localStorage.setItem('zm-language', languageCode);
    } catch (error) {
      console.warn('Could not store language preference');
    }

    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('lang', languageCode);
    window.history.replaceState({}, '', url.toString());

    // Apply language changes
    this.applyLanguageAttributes();
    this.updateTranslatedContent();

    // Track language change
    if ((window as any).ZMAnalytics) {
      (window as any).ZMAnalytics.track('language_changed', {
        from: this.currentLanguage.code,
        to: languageCode
      });
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): LanguageConfig {
    return this.currentLanguage;
  }

  /**
   * Apply language attributes to document
   */
  private applyLanguageAttributes(): void {
    // Set document language
    document.documentElement.lang = this.currentLanguage.code;

    // Set text direction
    document.documentElement.dir = this.currentLanguage.direction;

    // Update meta tags
    this.updateMetaTags();
  }

  /**
   * Update meta tags for SEO
   */
  private updateMetaTags(): void {
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    if (title) {
      // Add language suffix to title if not English
      if (this.currentLanguage.code !== 'en') {
        title.textContent = `${title.textContent} - ${this.currentLanguage.nativeName}`;
      }
    }

    // Update Open Graph locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', `${this.currentLanguage.code}_${this.currentLanguage.code.toUpperCase()}`);
    }
  }

  /**
   * Update translated content on the page
   */
  private updateTranslatedContent(): void {
    // Update elements with data-i18n attributes
    const translatableElements = document.querySelectorAll('[data-i18n]');

    translatableElements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key && this.translations[key]) {
        const translation = this.translations[key][this.currentLanguage.code] ||
                           this.translations[key]['en'] ||
                           key;

        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translation);
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update ARIA labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      if (key && this.translations[key]) {
        const translation = this.translations[key][this.currentLanguage.code] ||
                           this.translations[key]['en'] ||
                           key;
        element.setAttribute('aria-label', translation);
      }
    });
  }

  /**
   * Add translation for a key
   */
  addTranslation(key: string, translations: { [locale: string]: string }): void {
    this.translations[key] = translations;
  }

  /**
   * Get translation for a key
   */
  translate(key: string, fallback?: string): string {
    const translation = this.translations[key];
    if (!translation) return fallback || key;

    return translation[this.currentLanguage.code] ||
           translation['en'] ||
           fallback ||
           key;
  }

  /**
   * Format date according to current locale
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.currentLanguage.code, options).format(date);
  }

  /**
   * Format number according to current locale
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLanguage.code, options).format(number);
  }

  /**
   * Format currency according to current locale
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(this.currentLanguage.code, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): LanguageConfig[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(languageCode: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
  }

  /**
   * Get language config by code
   */
  getLanguageConfig(languageCode: string): LanguageConfig | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
  }
}

// Export singleton instance and utilities
export const languageManager = LanguageManager.getInstance();

// Convenience functions
export const setLanguage = (code: string) => languageManager.setLanguage(code);
export const getCurrentLanguage = () => languageManager.getCurrentLanguage();
export const translate = (key: string, fallback?: string) => languageManager.translate(key, fallback);
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) =>
  languageManager.formatDate(date, options);
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) =>
  languageManager.formatNumber(number, options);
export const formatCurrency = (amount: number, currency?: string) =>
  languageManager.formatCurrency(amount, currency);
export const getSupportedLanguages = () => languageManager.getSupportedLanguages();
