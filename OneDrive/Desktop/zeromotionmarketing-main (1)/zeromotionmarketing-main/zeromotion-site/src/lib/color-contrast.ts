/// <reference path="../env.d.ts" />

/**
 * Color Contrast Utility for WCAG 2.1 AA Compliance
 * Provides functions to calculate and verify color contrast ratios
 */

export interface ColorContrastResult {
  ratio: number;
  isAA: boolean;
  isAAA: boolean;
  level: 'Fail' | 'AA' | 'AAA';
  recommendation?: string;
}

export interface ColorPair {
  foreground: string;
  background: string;
  context: string;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to relative luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const normalize = (color: number) => {
    color = color / 255;
    return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
  };

  const rNorm = normalize(r);
  const gNorm = normalize(g);
  const bNorm = normalize(b);

  return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrastCompliance(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): ColorContrastResult {
  const ratio = calculateContrastRatio(foreground, background);

  // WCAG 2.1 AA standards
  const aaThreshold = isLargeText ? 3.0 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7.0;

  const isAA = ratio >= aaThreshold;
  const isAAA = ratio >= aaaThreshold;

  let level: 'Fail' | 'AA' | 'AAA';
  let recommendation: string | undefined;

  if (isAAA) {
    level = 'AAA';
  } else if (isAA) {
    level = 'AA';
    recommendation = isLargeText
      ? 'Consider increasing contrast to meet AAA standards (4.5:1)'
      : 'Consider increasing contrast to meet AAA standards (7:1)';
  } else {
    level = 'Fail';
    recommendation = isLargeText
      ? `Increase contrast to at least 3:1 for large text (current: ${ratio.toFixed(2)}:1)`
      : `Increase contrast to at least 4.5:1 for normal text (current: ${ratio.toFixed(2)}:1)`;
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    isAA,
    isAAA,
    level,
    recommendation
  };
}

/**
 * Get all CSS custom properties (CSS variables) from the document
 */
export function getCSSCustomProperties(): { [key: string]: string } {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const properties: { [key: string]: string } = {};

  // Get all CSS custom properties
  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i];
    if (prop.startsWith('--')) {
      properties[prop] = styles.getPropertyValue(prop).trim();
    }
  }

  return properties;
}

/**
 * Analyze contrast for all text elements on the page
 */
export function analyzePageContrast(): ColorPair[] {
  const results: ColorPair[] = [];
  const elements = document.querySelectorAll('*');

  elements.forEach(element => {
    const style = getComputedStyle(element);

    // Skip elements that don't contain text or are not visible
    if (style.display === 'none' || style.visibility === 'hidden' || !element.textContent?.trim()) {
      return;
    }

    // Get computed colors
    const color = style.color;
    const backgroundColor = style.backgroundColor;

    // Convert RGB/RGBA to hex for consistency
    const fgHex = rgbToHex(color);
    const bgHex = rgbToHex(backgroundColor);

    if (fgHex && bgHex && fgHex !== bgHex) {
      results.push({
        foreground: fgHex,
        background: bgHex,
        context: element.tagName.toLowerCase() + (element.className ? '.' + element.className.split(' ').join('.') : '')
      });
    }
  });

  return results;
}

/**
 * Convert RGB/RGBA color to hex
 */
function rgbToHex(color: string): string | null {
  // Handle rgb/rgba format
  const rgbMatch = color.match(/^rgb(a?)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);

  if (rgbMatch) {
    const r = parseInt(rgbMatch[2]);
    const g = parseInt(rgbMatch[3]);
    const b = parseInt(rgbMatch[4]);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Handle hex format
  if (color.startsWith('#')) {
    return color;
  }

  return null;
}

/**
 * Generate accessibility report for color contrast
 */
export function generateContrastReport(): {
  totalElements: number;
  compliantElements: number;
  nonCompliantElements: number;
  issues: Array<{
    element: string;
    ratio: number;
    level: string;
    recommendation: string;
  }>;
} {
  const colorPairs = analyzePageContrast();
  const issues: Array<{
    element: string;
    ratio: number;
    level: string;
    recommendation: string;
  }> = [];

  let compliantElements = 0;
  let nonCompliantElements = 0;

  colorPairs.forEach(pair => {
    try {
      const result = checkContrastCompliance(pair.foreground, pair.background);

      if (result.level === 'Fail') {
        nonCompliantElements++;
        issues.push({
          element: pair.context,
          ratio: result.ratio,
          level: result.level,
          recommendation: result.recommendation || 'Increase contrast ratio'
        });
      } else {
        compliantElements++;
      }
    } catch (error) {
      // Skip invalid color combinations
      console.warn('Could not analyze contrast for:', pair);
    }
  });

  return {
    totalElements: colorPairs.length,
    compliantElements,
    nonCompliantElements,
    issues
  };
}

/**
 * Apply enhanced contrast utilities to the page
 */
export function applyEnhancedContrast(): void {
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced contrast utilities for accessibility */

    /* High contrast text on dark backgrounds */
    .text-high-contrast {
      color: #ffffff !important;
    }

    /* Improved contrast for muted text */
    .text-muted-contrast {
      color: #d1d1d8 !important;
    }

    /* Error text with guaranteed contrast */
    .text-error-contrast {
      color: #ff6b6b !important;
    }

    /* Success text with guaranteed contrast */
    .text-success-contrast {
      color: #51cf66 !important;
    }

    /* Warning text with guaranteed contrast */
    .text-warning-contrast {
      color: #ffd43b !important;
    }

    /* Focus indicators with high contrast */
    .focus-high-contrast:focus-visible {
      outline: 3px solid #ffffff !important;
      outline-offset: 2px !important;
    }

    /* Dark mode high contrast overrides */
    @media (prefers-color-scheme: dark) {
      .text-high-contrast {
        color: #ffffff !important;
      }

      .text-muted-contrast {
        color: #e0e0e0 !important;
      }
    }

    /* Light mode high contrast overrides */
    @media (prefers-color-scheme: light) {
      .text-high-contrast {
        color: #000000 !important;
      }

      .text-muted-contrast {
        color: #333333 !important;
      }
    }

    /* Print styles for high contrast */
    @media print {
      .text-high-contrast {
        color: #000000 !important;
      }

      .text-muted-contrast {
        color: #666666 !important;
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Monitor contrast changes and report issues
 */
export class ContrastMonitor {
  private observer: MutationObserver | null = null;
  private lastReport: any = null;

  constructor() {
    this.init();
  }

  private init() {
    // Monitor DOM changes that might affect contrast
    this.observer = new MutationObserver(() => {
      this.checkContrastChanges();
    });

    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });

    // Initial check
    this.checkContrastChanges();
  }

  private checkContrastChanges() {
    const report = generateContrastReport();

    // Log significant changes
    if (this.lastReport && report.nonCompliantElements !== this.lastReport.nonCompliantElements) {
      console.warn('Contrast compliance changed:', {
        previous: this.lastReport.nonCompliantElements,
        current: report.nonCompliantElements,
        issues: report.issues
      });
    }

    this.lastReport = report;

    // Report to analytics if available
    if ((window as any).ZMAnalytics && report.nonCompliantElements > 0) {
      (window as any).ZMAnalytics.track('contrast_issues_detected', {
        nonCompliantElements: report.nonCompliantElements,
        totalElements: report.totalElements
      });
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
