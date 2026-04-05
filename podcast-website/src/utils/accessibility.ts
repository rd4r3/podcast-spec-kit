/**
 * Accessibility Utilities
 * Helper functions for implementing accessible features across the application
 */

/**
 * Skip to main content utility
 * Allows keyboard users to skip navigation and jump to main content
 */
export const createSkipLink = (): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white';
  skipLink.textContent = 'Skip to main content';
  return skipLink;
};

/**
 * Check if prefers reduced motion is enabled
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if dark mode is preferred
 */
export const prefersDarkMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Announce messages to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read
  setTimeout(() => {
    announcement.remove();
  }, 1000);
};

/**
 * Focus management utility
 */
export const focusElement = (element: HTMLElement | null): void => {
  if (element) {
    element.focus();
    // Ensure the element is visible
    if (element.scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

/**
 * Keyboard navigation utility
 */
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  callbacks: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onTab?: () => void;
  }
): void => {
  switch (event.key) {
    case 'Enter':
      if (callbacks.onEnter) {
        event.preventDefault();
        callbacks.onEnter();
      }
      break;
    case ' ':
      if (callbacks.onSpace) {
        event.preventDefault();
        callbacks.onSpace();
      }
      break;
    case 'Escape':
      if (callbacks.onEscape) {
        event.preventDefault();
        callbacks.onEscape();
      }
      break;
    case 'ArrowUp':
      if (callbacks.onArrowUp) {
        event.preventDefault();
        callbacks.onArrowUp();
      }
      break;
    case 'ArrowDown':
      if (callbacks.onArrowDown) {
        event.preventDefault();
        callbacks.onArrowDown();
      }
      break;
    case 'Tab':
      if (callbacks.onTab) {
        callbacks.onTab();
      }
      break;
    default:
      break;
  }
};

/**
 * Color contrast checker
 */
export const getContrastRatio = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * WCAG compliance level checker
 */
export const getWCAGLevel = (contrastRatio: number): 'AAA' | 'AA' | 'fail' => {
  if (contrastRatio >= 7) return 'AAA';
  if (contrastRatio >= 4.5) return 'AA';
  return 'fail';
};
