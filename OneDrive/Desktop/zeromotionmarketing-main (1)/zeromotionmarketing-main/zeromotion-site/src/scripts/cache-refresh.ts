/**
 * Global Cache Refresh System
 * Forces browser to refresh cached images when needed
 */

class CacheRefresher {
  private cacheVersion: number;
  
  constructor() {
    this.cacheVersion = Date.now();
    this.init();
  }
  
  private init(): void {
    // Run cache refresh on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.refreshImages());
    } else {
      this.refreshImages();
    }
  }
  
  private refreshImages(): void {
    // Target specific image selectors that commonly get cached
    const imageSelectors = [
      'img[src*="/assets/implementation/"]',
      'img[src*="/assets/zeromotion_workflow_"]',
      'img[src*="/assets/crm-"]',
      '[style*="background-image"][style*="/assets/"]'
    ];
    
    imageSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => this.refreshElement(element));
    });
    
    console.log(`🔄 Cache refresh applied to ${this.getRefreshedCount()} images`);
  }
  
  private refreshElement(element: Element): void {
    if (element instanceof HTMLImageElement) {
      this.refreshImageSrc(element);
    } else if (element instanceof HTMLElement) {
      this.refreshBackgroundImage(element);
    }
  }
  
  private refreshImageSrc(img: HTMLImageElement): void {
    const currentSrc = img.src;
    if (currentSrc && !currentSrc.includes('?v=')) {
      const newSrc = this.addCacheParam(currentSrc);
      img.src = newSrc;
      img.dataset.cacheRefreshed = 'true';
    }
  }
  
  private refreshBackgroundImage(element: HTMLElement): void {
    const style = element.style.backgroundImage;
    if (style && style.includes('url(') && !style.includes('?v=')) {
      const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        const newUrl = this.addCacheParam(urlMatch[1]);
        element.style.backgroundImage = `url('${newUrl}')`;
        element.dataset.cacheRefreshed = 'true';
      }
    }
  }
  
  private addCacheParam(url: string): string {
    // Don't add cache param to external URLs or data URLs
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${this.cacheVersion}`;
  }
  
  private getRefreshedCount(): number {
    return document.querySelectorAll('[data-cache-refreshed="true"]').length;
  }
  
  /**
   * Force refresh specific images by selector
   */
  public forceRefresh(selector: string): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => this.refreshElement(element));
  }
  
  /**
   * Get current cache version
   */
  public getCacheVersion(): number {
    return this.cacheVersion;
  }
}

// Initialize cache refresher
const cacheRefresher = new CacheRefresher();

// Export for global access
(window as any).cacheRefresher = cacheRefresher;

// Export for module usage
export { CacheRefresher };
export default cacheRefresher;
