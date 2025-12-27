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
    
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Check if device has fine pointer (mouse) capability
    // This helps distinguish touchscreen laptops (which have hover) from mobile devices
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    // Consider mobile if:
    // 1. Width <= 768px (primary check - most reliable for responsive design), OR
    // 2. Mobile user agent (regardless of width - tablets/phones)
    // We don't check touch capability alone because touchscreen laptops exist
    // and should support hover interactions
    return width <= 768 || (isMobileUA && !hasHover);
  });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // Check if device has fine pointer (mouse) capability
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      // Consider mobile if:
      // 1. Width <= 768px (primary check - most reliable for responsive design), OR
      // 2. Mobile user agent without hover capability (true mobile devices)
      // We don't check touch capability alone because touchscreen laptops exist
      // and should support hover interactions
      setIsMobile(width <= 768 || (isMobileUA && !hasHover));
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

