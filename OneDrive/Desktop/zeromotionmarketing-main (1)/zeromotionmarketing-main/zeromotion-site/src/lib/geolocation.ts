/**
 * Geolocation Service for ZeroMotion Marketing
 * Provides IP-based geolocation with privacy compliance (GDPR/CCPA)
 */

export interface GeolocationData {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
  isp: string;
  privacyCompliant: boolean;
}

export interface PrivacyJurisdiction {
  requiresConsent: boolean;
  requiresOptOut: boolean;
  hasDataRights: boolean;
  jurisdiction: 'gdpr' | 'ccpa' | 'other';
}

class GeolocationService {
  private static instance: GeolocationService;
  private cache: Map<string, { data: GeolocationData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly API_ENDPOINT = 'https://ipapi.co/json/';

  private constructor() {}

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  /**
   * Get geolocation data for current user
   */
  async getLocation(): Promise<GeolocationData | null> {
    try {
      // Check cache first
      const cached = this.getCachedLocation();
      if (cached) {
        return cached;
      }

      // Get IP-based location
      const response = await fetch(this.API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Geolocation API error: ${response.status}`);
      }

      const data = await response.json();

      const locationData: GeolocationData = {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        region: data.region || 'Unknown',
        regionCode: data.region_code || 'XX',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'UTC',
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        isp: data.org || 'Unknown',
        privacyCompliant: this.isPrivacyCompliant(data.country_code),
      };

      // Cache the result
      this.setCachedLocation(locationData);

      return locationData;
    } catch (error) {
      console.warn('Geolocation service error:', error);
      return this.getFallbackLocation();
    }
  }

  /**
   * Get privacy jurisdiction information
   */
  getPrivacyJurisdiction(locationData: GeolocationData): PrivacyJurisdiction {
    const countryCode = locationData.countryCode.toUpperCase();
    const regionCode = locationData.regionCode.toUpperCase();

    // GDPR countries (EU + UK + Switzerland + Norway + Iceland + Liechtenstein)
    const gdprCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'NO',
      'IS', 'LI'
    ];

    // CCPA states (California)
    const ccpaStates = ['CA'];
    const isCalifornia = countryCode === 'US' && ccpaStates.includes(regionCode);

    if (gdprCountries.includes(countryCode)) {
      return {
        requiresConsent: true,
        requiresOptOut: false,
        hasDataRights: true,
        jurisdiction: 'gdpr',
      };
    } else if (isCalifornia) {
      return {
        requiresConsent: true,
        requiresOptOut: true,
        hasDataRights: true,
        jurisdiction: 'ccpa',
      };
    } else {
      return {
        requiresConsent: false,
        requiresOptOut: false,
        hasDataRights: false,
        jurisdiction: 'other',
      };
    }
  }

  /**
   * Check if location requires privacy compliance
   */
  private isPrivacyCompliant(countryCode: string): boolean {
    const privacyCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'NO',
      'IS', 'LI', 'US' // US for CCPA
    ];

    return privacyCountries.includes(countryCode?.toUpperCase());
  }

  /**
   * Get cached location if available and not expired
   */
  private getCachedLocation(): GeolocationData | null {
    const cacheKey = 'zeromotion_geolocation';
    const cached = this.cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    // Try localStorage as fallback
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < this.CACHE_DURATION) {
          this.cache.set(cacheKey, parsed);
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Error reading geolocation from localStorage:', error);
    }

    return null;
  }

  /**
   * Cache location data
   */
  private setCachedLocation(data: GeolocationData): void {
    const cacheKey = 'zeromotion_geolocation';
    const cacheEntry = { data, timestamp: Date.now() };

    this.cache.set(cacheKey, cacheEntry);

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Error storing geolocation in localStorage:', error);
    }
  }

  /**
   * Get fallback location when geolocation fails
   */
  private getFallbackLocation(): GeolocationData | null {
    // Try to infer from browser language
    const language = navigator.language.split('-')[0];
    const country = navigator.language.split('-')[1];

    // Basic fallback based on language
    if (language === 'en' && country === 'US') {
      return {
        country: 'United States',
        countryCode: 'US',
        region: 'Unknown',
        regionCode: 'XX',
        city: 'Unknown',
        timezone: 'America/New_York',
        latitude: 39.8283,
        longitude: -98.5795,
        isp: 'Unknown',
        privacyCompliant: true,
      };
    }

    return null;
  }

  /**
   * Clear cached location data
   */
  clearCache(): void {
    const cacheKey = 'zeromotion_geolocation';
    this.cache.delete(cacheKey);

    try {
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Error clearing geolocation cache:', error);
    }
  }

  /**
   * Check if user is in a specific region
   */
  isInRegion(countryCode: string, regionCode?: string): boolean {
    const location = this.getCachedLocation();
    if (!location) return false;

    if (regionCode) {
      return location.countryCode === countryCode && location.regionCode === regionCode;
    }

    return location.countryCode === countryCode;
  }

  /**
   * Get distance between two points (in kilometers)
   */
  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();

// Export convenience functions
export const getUserLocation = () => geolocationService.getLocation();
export const getPrivacyJurisdiction = (location: GeolocationData) =>
  geolocationService.getPrivacyJurisdiction(location);
export const isInRegion = (countryCode: string, regionCode?: string) =>
  geolocationService.isInRegion(countryCode, regionCode);
export const clearGeolocationCache = () => geolocationService.clearCache();
