import React, { useState, useRef } from 'react';
import PhotoTooltip from './PhotoTooltip';
import { useIsMobile } from '../utils/mobileDetection';

const WordWithPhoto = ({ word, photoPath, className = '' }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const wordRef = useRef(null);
  const isMobile = useIsMobile();
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Small delay to prevent flickering
    showTimeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    // Clear any pending show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    
    // Small delay to allow moving cursor to tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 100);
  };

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle tooltip on mobile
    if (isTooltipVisible) {
      setIsTooltipVisible(false);
    } else {
      // Clear any pending timeouts
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      setIsTooltipVisible(true);
    }
  };

  const handleClose = () => {
    setIsTooltipVisible(false);
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <span
        ref={wordRef}
        className={`inline-block relative cursor-pointer text-accent-purple/80 hover:text-accent-purple font-medium underline decoration-accent-purple/30 hover:decoration-accent-purple/60 transition-all duration-300 hover:scale-105 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        style={{ touchAction: 'manipulation' }}
      >
        {word}
      </span>
      <PhotoTooltip
        photoPath={photoPath}
        wordRef={wordRef}
        isVisible={isTooltipVisible}
        onClose={handleClose}
      />
    </>
  );
};

export default WordWithPhoto;

