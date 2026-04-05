/**
 * Performance Monitoring Hook
 * Tracks page load times and performance metrics
 */

import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

/**
 * Hook to monitor and report page performance metrics
 * Uses the Web Vitals API to track key performance indicators
 */
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Track page load time
    window.addEventListener('load', () => {
      if (performance && performance.timing) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        
        // Log additional metrics if available
        if (perfData.domInteractive) {
          const domInteractiveTime = perfData.domInteractive - perfData.navigationStart;
          console.log(`DOM Interactive Time: ${domInteractiveTime}ms`);
        }
        
        if (perfData.domContentLoadedEventEnd) {
          const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
          console.log(`DOM Content Loaded Time: ${domContentLoadedTime}ms`);
        }
      }
    });

    // Track Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              console.log(`First Contentful Paint: ${Math.round(entry.startTime)}ms`);
            }
          }
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const paintTime = (lastEntry as any).renderTime || (lastEntry as any).loadTime || lastEntry.startTime;
          console.log(`Largest Contentful Paint: ${Math.round(paintTime)}ms`);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
              console.log(`Cumulative Layout Shift: ${clsValue.toFixed(3)}`);
            }
          }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Navigation Timing
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const navigationTiming = entry as PerformanceNavigationTiming;
            console.log(`Navigation Timing:`, {
              duration: Math.round(navigationTiming.duration),
              domInteractive: Math.round(navigationTiming.domInteractive),
              domContentLoaded: Math.round(navigationTiming.domContentLoadedEventEnd),
            });
          }
        });
        
        navigationObserver.observe({ entryTypes: ['navigation'] });

        // Cleanup on unmount
        return () => {
          paintObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          navigationObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }, []);
};

/**
 * Function to report metrics to an external service
 * Can be called with custom metrics
 */
export const reportMetric = (name: string, value: number) => {
  // Example: Send to analytics service
  if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
    try {
      const data = JSON.stringify({
        name,
        value,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
      
      // Send to analytics endpoint (customize with your own endpoint)
      navigator.sendBeacon('/api/metrics', data);
    } catch (error) {
      console.warn('Failed to report metric:', error);
    }
  }
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = (): Partial<PerformanceMetrics> => {
  if (typeof window === 'undefined' || !performance) {
    return {};
  }

  const metrics: Partial<PerformanceMetrics> = {};
  
  if (performance.timing) {
    const perfData = performance.timing;
    metrics.pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  }

  // Try to get Web Vitals data
  if ('getEntriesByType' in performance) {
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.firstContentfulPaint = Math.round(fcpEntry.startTime);
    }

    // Largest Contentful Paint
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lastLcp = lcpEntries[lcpEntries.length - 1];
      const paintTime = (lastLcp as any).renderTime || (lastLcp as any).loadTime || lastLcp.startTime;
      metrics.largestContentfulPaint = Math.round(paintTime);
    }
  }

  return metrics;
};
