/**
 * Dev-only Button Overflow Detection Script
 * Flags any button where text still overflows after our global baseline implementation
 * 
 * Usage: Include this script in development builds only
 * It will add red dashed outlines to buttons with overflow issues
 */

// Only run in development
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  document.addEventListener('DOMContentLoaded', () => {
    // Button selectors matching our global baseline
    const buttonSelectors = [
      'button',
      '[type="button"]',
      '[type="submit"]', 
      '[type="reset"]',
      '.btn',
      'a.btn',
      'a.button',
      '[role="button"]'
    ].join(', ');

    const buttons = document.querySelectorAll(buttonSelectors) as NodeListOf<HTMLElement>;
    let overflowCount = 0;

    buttons.forEach((button) => {
      // Skip buttons that have opted out
      if (button.hasAttribute('data-btn-optout') && button.getAttribute('data-btn-optout') === 'true') {
        return;
      }

      // Check for text overflow after layout
      const hasVerticalOverflow = button.scrollHeight > button.clientHeight;
      const hasHorizontalOverflow = button.scrollWidth > button.clientWidth;

      if (hasVerticalOverflow || hasHorizontalOverflow) {
        overflowCount++;
        
        // Add visual indicator
        button.style.outline = '2px dashed red';
        button.style.outlineOffset = '2px';
        
        // Add data attribute for debugging
        button.setAttribute('data-overflow-detected', 'true');
        
        // Log details
        console.warn('Button overflow detected:', {
          element: button,
          text: button.textContent?.trim(),
          verticalOverflow: hasVerticalOverflow,
          horizontalOverflow: hasHorizontalOverflow,
          scrollHeight: button.scrollHeight,
          clientHeight: button.clientHeight,
          scrollWidth: button.scrollWidth,
          clientWidth: button.clientWidth,
          computedStyles: {
            fontSize: getComputedStyle(button).fontSize,
            lineHeight: getComputedStyle(button).lineHeight,
            padding: getComputedStyle(button).padding,
            whiteSpace: getComputedStyle(button).whiteSpace,
            wordBreak: getComputedStyle(button).wordBreak
          }
        });
      }
    });

    // Summary log
    if (overflowCount > 0) {
      console.warn(`🚨 Found ${overflowCount} buttons with overflow issues. Check red dashed outlines.`);
      console.info('💡 To fix: Check if buttons need longer text, smaller font, or different container constraints.');
    } else {
      console.info('✅ All buttons pass overflow check - text is properly contained!');
    }

    // Add a global style for easy identification
    if (overflowCount > 0) {
      const style = document.createElement('style');
      style.textContent = `
        [data-overflow-detected="true"]::after {
          content: "⚠️ OVERFLOW";
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: red;
          color: white;
          font-size: 10px;
          padding: 2px 4px;
          border-radius: 2px;
          z-index: 9999;
          pointer-events: none;
          font-family: monospace;
        }
      `;
      document.head.appendChild(style);
    }
  });
}

export {};
