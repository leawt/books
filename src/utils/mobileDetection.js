import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the user is on a mobile device
 * Checks screen width, touch capability, and user agent
 * @returns {boolean} true if on mobile device, false otherwise
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initial check on mount
    if (typeof window === 'undefined') return false;
    
    const width = window.innerWidth;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Consider mobile if:
    // 1. Width <= 768px (primary check - most reliable for responsive design), OR
    // 2. Width <= 1024px AND has touch capability, OR
    // 3. Width <= 1024px AND has mobile user agent
    // This makes it work in Chrome DevTools emulation (which may not have touch events)
    return width <= 768 || (width <= 1024 && (hasTouch || isMobileUA));
  });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // Consider mobile if:
      // 1. Width <= 768px (primary check - most reliable for responsive design), OR
      // 2. Width <= 1024px AND has touch capability, OR
      // 3. Width <= 1024px AND has mobile user agent
      // This makes it work in Chrome DevTools emulation (which may not have touch events)
      setIsMobile(width <= 768 || (width <= 1024 && (hasTouch || isMobileUA)));
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return isMobile;
};

