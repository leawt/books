import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '../utils/mobileDetection';

const PhotoTooltip = ({ photoPath, wordRef, isVisible, onClose }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const tooltipRef = useRef(null);
  const isMobile = useIsMobile();

  // Calculate tooltip position
  const updatePosition = useCallback(() => {
    if (!isVisible || !wordRef.current || !tooltipRef.current) return;

    const wordRect = wordRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    
    // Wait for tooltip to render to get its dimensions
    requestAnimationFrame(() => {
      if (!tooltip) return;
      
      const tooltipRect = tooltip.getBoundingClientRect();
      const padding = 16;
      const offset = 12; // Distance from word
      
      let leftPos, topPos;
      
      if (isMobile) {
        // On mobile, center above the word
        leftPos = wordRect.left + wordRect.width / 2 - tooltipRect.width / 2;
        topPos = wordRect.top - tooltipRect.height - offset;
        
        // If tooltip would go off top, position below
        if (topPos < padding) {
          topPos = wordRect.bottom + offset;
        }
      } else {
        // On desktop, position in the right margin
        // Find the content container by looking for the parent with max-w-3xl
        let contentContainer = wordRef.current.closest('.max-w-3xl');
        let contentRight = window.innerWidth - padding;
        let contentLeft = padding;
        
        if (contentContainer) {
          const containerRect = contentContainer.getBoundingClientRect();
          contentRight = containerRect.right;
          contentLeft = containerRect.left;
        } else {
          // Fallback: assume max-w-3xl (768px) centered
          const contentMaxWidth = 768;
          contentLeft = (window.innerWidth - contentMaxWidth) / 2;
          contentRight = contentLeft + contentMaxWidth;
        }
        
        // Position in the right margin, aligned with the word vertically
        leftPos = contentRight + offset;
        topPos = wordRect.top; // getBoundingClientRect already accounts for scroll
        
        // If there's not enough space on the right, try left margin
        if (leftPos + tooltipRect.width > window.innerWidth - padding) {
          leftPos = contentLeft - tooltipRect.width - offset;
          
          // If still not enough space, fall back to below the word
          if (leftPos < padding) {
            leftPos = wordRect.left + wordRect.width / 2 - tooltipRect.width / 2;
            topPos = wordRect.bottom + offset;
          }
        }
      }
      
      // Keep tooltip within viewport
      if (leftPos < padding) {
        leftPos = padding;
      } else if (leftPos + tooltipRect.width > window.innerWidth - padding) {
        leftPos = window.innerWidth - tooltipRect.width - padding;
      }
      
      if (topPos < padding) {
        topPos = padding;
      } else if (topPos + tooltipRect.height > window.innerHeight - padding) {
        topPos = window.innerHeight - tooltipRect.height - padding;
      }
      
      setTooltipPosition({ left: leftPos, top: topPos });
    });
  }, [isVisible, isMobile]);

  useEffect(() => {
    updatePosition();
    
    // Update position on scroll and resize
    if (isVisible) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, updatePosition]);

  // Handle clicks outside to close tooltip on mobile
  useEffect(() => {
    if (!isVisible || !isMobile) return;

    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        wordRef.current &&
        !wordRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Small delay to prevent immediate close on the tap that opened it
    const timeout = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible, isMobile, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      className="fixed pointer-events-none z-50 animate-fadeIn"
      style={{
        left: `${tooltipPosition.left}px`,
        top: `${tooltipPosition.top}px`,
      }}
    >
      <div className="bg-background/98 backdrop-blur-md border border-accent-purple/50 rounded-lg shadow-soft-lg p-3 max-w-[300px] sm:max-w-[400px] transition-all duration-300">
        {!imageLoaded && !imageError && (
          <div className="w-full h-48 bg-accent-purple/10 rounded-md flex items-center justify-center">
            <div className="text-text-secondary text-sm">Loading...</div>
          </div>
        )}
        {imageError ? (
          <div className="w-full h-48 bg-accent-purple/10 rounded-md flex items-center justify-center">
            <div className="text-text-secondary text-sm">Image not found</div>
          </div>
        ) : (
          <img
            src={photoPath}
            alt=""
            className={`w-full h-auto rounded-md shadow-sm transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export default PhotoTooltip;

