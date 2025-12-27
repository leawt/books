import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '../utils/mobileDetection';

// Calculate complementary color (180° rotation on color wheel)
const calculateComplementaryColor = (color) => {
  let r, g, b;
  
  if (color.startsWith('rgb(')) {
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    } else {
      return '#8B7BA8'; // Default fallback
    }
  } else if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return '#8B7BA8'; // Default fallback
  }
  
  // Calculate complementary color (255 - each component)
  const compR = Math.max(0, Math.min(255, 255 - r));
  const compG = Math.max(0, Math.min(255, 255 - g));
  const compB = Math.max(0, Math.min(255, 255 - b));
  
  return `rgb(${compR}, ${compG}, ${compB})`;
};

// Utility function to extract dominant and complementary colors from an image
const extractColors = (imageUrl, callback) => {
  const defaultColor = '#8B7BA8';
  if (!imageUrl) {
    callback(defaultColor, calculateComplementaryColor(defaultColor));
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 50; // Small size for faster processing
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      
      const imageData = ctx.getImageData(0, 0, 50, 50);
      const data = imageData.data;
      
      // Sample colors and find the most common one
      const colorMap = {};
      const sampleSize = 10; // Sample every nth pixel
      
      for (let i = 0; i < data.length; i += sampleSize * 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Quantize colors to reduce noise
        const quantizedR = Math.floor(r / 32) * 32;
        const quantizedG = Math.floor(g / 32) * 32;
        const quantizedB = Math.floor(b / 32) * 32;
        
        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
        colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
      }
      
      // Find the most common color
      let maxCount = 0;
      let dominantColor = defaultColor;
      
      for (const [colorKey, count] of Object.entries(colorMap)) {
        if (count > maxCount) {
          maxCount = count;
          const [r, g, b] = colorKey.split(',').map(Number);
          dominantColor = `rgb(${r}, ${g}, ${b})`;
        }
      }
      
      // Calculate complementary color
      const complementaryColor = calculateComplementaryColor(dominantColor);
      callback(dominantColor, complementaryColor);
    } catch (error) {
      console.error('Error extracting color:', error);
      callback(defaultColor, calculateComplementaryColor(defaultColor));
    }
  };
  
  img.onerror = () => {
    callback(defaultColor, calculateComplementaryColor(defaultColor));
  };
  
  img.src = imageUrl;
};

// Helper function to convert color to rgba with opacity
const colorToRgba = (color, opacity = 1) => {
  if (color.startsWith('rgb(')) {
    // Extract RGB values and add opacity
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
    }
  } else if (color.startsWith('#')) {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color; // Fallback
};

// Pie chart component for fiction/non-fiction/poetry
const FictionNonFictionPieChart = ({ fictionCount, nonFictionCount, poetryCount, total }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  
  const size = 100; // Smaller size
  const center = size / 2;
  const radius = 45;
  const innerRadius = 20;
  
  // Calculate angles
  const fictionPercentage = total > 0 ? (fictionCount / total) * 100 : 0;
  const nonFictionPercentage = total > 0 ? (nonFictionCount / total) * 100 : 0;
  const poetryPercentage = total > 0 ? (poetryCount / total) * 100 : 0;
  
  const fictionAngle = (fictionPercentage / 100) * 360;
  const nonFictionAngle = (nonFictionPercentage / 100) * 360;
  const poetryAngle = (poetryPercentage / 100) * 360;
  
  // Helper function to create arc path for donut chart
  const createArcPath = (startAngle, endAngle, outerRadius, innerRadius) => {
    const angleDiff = endAngle - startAngle;
    
    // Handle full circle (360 degrees) - need to use a point slightly before the end
    if (Math.abs(angleDiff) >= 360) {
      const start = (startAngle * Math.PI) / 180;
      const end = ((startAngle + 359.9) * Math.PI) / 180; // Use 359.9 to avoid same start/end point
      const x1 = center + outerRadius * Math.cos(start);
      const y1 = center + outerRadius * Math.sin(start);
      const x2 = center + outerRadius * Math.cos(end);
      const y2 = center + outerRadius * Math.sin(end);
      const x3 = center + innerRadius * Math.cos(end);
      const y3 = center + innerRadius * Math.sin(end);
      const x4 = center + innerRadius * Math.cos(start);
      const y4 = center + innerRadius * Math.sin(start);
      
      return [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
    }
    
    // Normal arc path
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = center + outerRadius * Math.cos(start);
    const y1 = center + outerRadius * Math.sin(start);
    const x2 = center + outerRadius * Math.cos(end);
    const y2 = center + outerRadius * Math.sin(end);
    const x3 = center + innerRadius * Math.cos(end);
    const y3 = center + innerRadius * Math.sin(end);
    const x4 = center + innerRadius * Math.cos(start);
    const y4 = center + innerRadius * Math.sin(start);
    
    const largeArc = angleDiff > 180 ? 1 : 0;
    
    return [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
  };
  
  // Calculate start angles for each slice
  let currentAngle = -90; // Start at top
  const fictionStart = currentAngle;
  currentAngle += fictionAngle;
  const nonFictionStart = currentAngle;
  currentAngle += nonFictionAngle;
  const poetryStart = currentAngle;
  
  // Update tooltip position
  useEffect(() => {
    if (!hoveredSlice || !tooltipRef.current) return;
    
    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 12;
    const offsetX = 8;
    const offsetY = 8;
    
    let leftPos = mousePosition.x + offsetX;
    let topPos = mousePosition.y + offsetY;
    
    if (leftPos + tooltipRect.width > window.innerWidth - padding) {
      leftPos = mousePosition.x - tooltipRect.width - offsetX;
    }
    if (leftPos < padding) {
      leftPos = padding;
    }
    
    if (topPos + tooltipRect.height > window.innerHeight - padding) {
      topPos = mousePosition.y - tooltipRect.height - offsetY;
    }
    if (topPos < padding) {
      topPos = padding;
    }
    
    setTooltipPosition({ left: leftPos, top: topPos });
  }, [hoveredSlice, mousePosition]);
  
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  const getTooltipContent = () => {
    if (!hoveredSlice) return null;
    
    if (hoveredSlice === 'fiction') {
      return `${fictionCount} ${fictionCount === 1 ? 'book' : 'books'} (${Math.round(fictionPercentage)}%)`;
    } else if (hoveredSlice === 'nonfiction') {
      return `${nonFictionCount} ${nonFictionCount === 1 ? 'book' : 'books'} (${Math.round(nonFictionPercentage)}%)`;
    } else if (hoveredSlice === 'poetry') {
      return `${poetryCount} ${poetryCount === 1 ? 'book' : 'books'} (${Math.round(poetryPercentage)}%)`;
    }
    return null;
  };
  
  return (
    <div className="flex flex-col items-center">
      <svg 
        width={size} 
        height={size} 
        className="cursor-pointer"
        onMouseMove={handleMouseMove}
      >
        {/* Fiction slice */}
        {fictionCount > 0 && fictionAngle > 0 && (
          <path
            d={createArcPath(fictionStart, fictionStart + fictionAngle, radius, innerRadius)}
            fill={hoveredSlice === 'fiction' ? 'rgba(139, 123, 168, 0.8)' : 'rgba(139, 123, 168, 0.6)'}
            stroke="rgba(139, 123, 168, 0.8)"
            strokeWidth="1"
            onMouseEnter={() => setHoveredSlice('fiction')}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{ transition: 'fill 0.2s ease' }}
          />
        )}
        
        {/* Non-fiction slice */}
        {nonFictionCount > 0 && nonFictionAngle > 0 && (
          <path
            d={createArcPath(nonFictionStart, nonFictionStart + nonFictionAngle, radius, innerRadius)}
            fill={hoveredSlice === 'nonfiction' ? 'rgba(107, 142, 135, 0.8)' : 'rgba(107, 142, 135, 0.6)'}
            stroke="rgba(107, 142, 135, 0.8)"
            strokeWidth="1"
            onMouseEnter={() => setHoveredSlice('nonfiction')}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{ transition: 'fill 0.2s ease' }}
          />
        )}
        
        {/* Poetry slice */}
        {poetryCount > 0 && poetryAngle > 0 && (
          <path
            d={createArcPath(poetryStart, poetryStart + poetryAngle, radius, innerRadius)}
            fill={hoveredSlice === 'poetry' ? 'rgba(180, 140, 120, 0.8)' : 'rgba(180, 140, 120, 0.6)'}
            stroke="rgba(180, 140, 120, 0.8)"
            strokeWidth="1"
            onMouseEnter={() => setHoveredSlice('poetry')}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{ transition: 'fill 0.2s ease' }}
          />
        )}
      </svg>
      
      {/* Tooltip */}
      {hoveredSlice && createPortal(
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
          }}
        >
          <div className="bg-background/98 backdrop-blur-md border border-accent-purple/50 rounded-lg shadow-soft-lg px-3 py-2">
            <div className="text-sm font-medium text-text-primary">
              {hoveredSlice === 'fiction' && 'Fiction'}
              {hoveredSlice === 'nonfiction' && 'Non-Fiction'}
              {hoveredSlice === 'poetry' && 'Poetry'}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              {getTooltipContent()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Timeline bar component with hover tooltip
const TimelineBar = ({ book, leftPercent, widthPercent, startStr, finishStr, formatDate, topOffset, barHeight = 10, hoveredBookId, onHoverChange, isLongRead = false, days = 1, isMobile = false }) => {
  const [dominantColor, setDominantColor] = useState('#8B7BA8');
  const [complementaryColor, setComplementaryColor] = useState('#8B7BA8');
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const [tappedBookId, setTappedBookId] = useState(null); // Track tapped book on mobile
  const barRef = useRef(null);
  const tooltipRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const tooltipDimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (book.coverImage) {
      extractColors(book.coverImage, (dominant, complementary) => {
        setDominantColor(dominant);
        setComplementaryColor(complementary);
      });
    } else {
      // Set default colors if no cover image
      const defaultColor = '#8B7BA8';
      setDominantColor(defaultColor);
      setComplementaryColor(calculateComplementaryColor(defaultColor));
    }
  }, [book.coverImage]);

  // Function to calculate and update tooltip position
  const updateTooltipPosition = (x, y, useBarCenter = false) => {
    if (!tooltipRef.current) return;
    
    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 12;
    
    let leftPos, topPos;
    
    if (useBarCenter && barRef.current) {
      // On mobile, center tooltip above/below the bar
      const barRect = barRef.current.getBoundingClientRect();
      leftPos = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
      topPos = barRect.top - tooltipRect.height - 8; // Position above bar
      
      // If tooltip would go off top, position below
      if (topPos < padding) {
        topPos = barRect.bottom + 8;
      }
    } else {
      // Desktop: position near cursor
      const offsetX = 8;
      const offsetY = 8;
      leftPos = x + offsetX;
      topPos = y + offsetY;
    }
    
    // Keep tooltip within viewport with padding
    if (leftPos + tooltipRect.width > window.innerWidth - padding) {
      leftPos = window.innerWidth - tooltipRect.width - padding;
    }
    if (leftPos < padding) {
      leftPos = padding;
    }
    
    if (topPos + tooltipRect.height > window.innerHeight - padding) {
      topPos = window.innerHeight - tooltipRect.height - padding;
    }
    if (topPos < padding) {
      topPos = padding;
    }
    
    setTooltipPosition({ left: leftPos, top: topPos });
  };

  // Update tooltip position when hovered and mouse moves
  useEffect(() => {
    if (!isHovered) return;
    
    // When tooltip first appears, wait for it to be rendered
    const updatePosition = () => {
      if (tooltipRef.current && isHovered) {
        if (isMobile) {
          // On mobile, center tooltip relative to bar
          updateTooltipPosition(0, 0, true);
        } else if (mousePosition.x > 0 && mousePosition.y > 0) {
          // On desktop, position near cursor
          updateTooltipPosition(mousePosition.x, mousePosition.y);
        }
      }
    };
    
    // Use double RAF to ensure DOM is ready when tooltip first appears
    let rafId1 = requestAnimationFrame(() => {
      rafId1 = requestAnimationFrame(updatePosition);
    });
    
    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
    };
  }, [isHovered, isMobile]);

  // Continuously update position as mouse moves (desktop only)
  useEffect(() => {
    if (!isHovered || !tooltipRef.current || isMobile) return;
    
    // Update position using requestAnimationFrame for smooth updates
    const rafId = requestAnimationFrame(() => {
      if (tooltipRef.current && isHovered) {
        updateTooltipPosition(mousePosition.x, mousePosition.y);
      }
    });
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [mousePosition.x, mousePosition.y, isHovered, isMobile]);

  const handleMouseEnter = () => {
    if (isMobile) return; // Skip on mobile
    // Clear any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    // Immediately notify parent component of hover state change for focus effect
    // This ensures the dimming effect happens immediately
    if (onHoverChange) {
      onHoverChange(book.id);
    }
    // Show tooltip after short delay to prevent flickering but not too fast
    showTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 30);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Skip on mobile
    // Clear any pending show
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    // Hide tooltip after delay to allow smooth transitions between bars
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      // Notify parent component to clear focus state
      if (onHoverChange) {
        onHoverChange(null);
      }
    }, 100);
  };

  const handleMouseMove = (e) => {
    if (isMobile) return; // Skip on mobile
    // Always update mouse position to track cursor
    const newPosition = { x: e.clientX, y: e.clientY };
    setMousePosition(newPosition);
  };

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle tooltip on tap
    if (tappedBookId === book.id) {
      // Already tapped, hide it
      setTappedBookId(null);
      setIsHovered(false);
      if (onHoverChange) {
        onHoverChange(null);
      }
    } else {
      // New tap, show this tooltip
      setTappedBookId(book.id);
      setIsHovered(true);
      if (onHoverChange) {
        onHoverChange(book.id);
      }
      // Update position after a short delay to ensure DOM is ready
      setTimeout(() => {
        updateTooltipPosition(0, 0, true);
      }, 50);
    }
  };

  // Handle clicks outside to close tooltip on mobile
  useEffect(() => {
    if (!isMobile || !isHovered) return;
    
    const handleClickOutside = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setTappedBookId(null);
        setIsHovered(false);
        if (onHoverChange) {
          onHoverChange(null);
        }
      }
    };
    
    // Use a small delay to avoid immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile, isHovered, onHoverChange]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Render tooltip in portal at document body level for proper z-index stacking
  const tooltipContent = isHovered ? (
    createPortal(
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none"
        style={{
          left: `${tooltipPosition.left}px`,
          top: `${tooltipPosition.top}px`,
          zIndex: 999999, // Extremely high z-index to appear above everything
        }}
      >
        <div className="bg-background/98 backdrop-blur-md border border-accent-purple/50 rounded-lg shadow-soft-lg p-3 max-w-[200px]">
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-auto rounded-md mb-2 shadow-sm"
              style={{ aspectRatio: '2/3', objectFit: 'cover' }}
            />
          )}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-text-primary mb-1 line-clamp-2">
              {book.title}
            </h4>
            <p className="text-xs text-text-secondary">
              {formatDate(startStr)} - {formatDate(finishStr)}
            </p>
          </div>
        </div>
      </div>,
      document.body
    )
  ) : null;

  // Expand hover area for easier interaction, especially for short books
  const hoverPadding = 8; // Padding around the visual bar (px) - larger for easier targeting
  const hoverAreaHeight = barHeight + (hoverPadding * 2); // Add padding above and below
  const hoverAreaTop = topOffset - hoverPadding; // Shift up to center visual bar
  const minHoverWidthPercent = Math.max(widthPercent, 2.0); // Minimum 2.0% width for hover area (larger target)
  
  // Calculate visual bar width as percentage of hover container
  // For short books, ensure visual bar is at least 50% of hover container width for visibility
  // This makes bars more visible: if hover is 2% of timeline, visual bar will be 1% of timeline (50% of 2%)
  const visualBarWidthAsPercentOfContainer = (widthPercent / minHoverWidthPercent) * 100;
  const minVisualBarPercentOfContainer = 50; // Minimum 50% of hover container = at least 1% of timeline
  const visualBarWidthPercent = Math.max(visualBarWidthAsPercentOfContainer, minVisualBarPercentOfContainer);

  // Apply focus state: dim other bars when one is hovered
  const isFocused = hoveredBookId === book.id;
  const isDimmed = hoveredBookId && hoveredBookId !== book.id;
  const baseOpacity = 1.0;
  const finalOpacity = isDimmed ? baseOpacity * 0.4 : baseOpacity;

  // Build background style
  let backgroundStyle = {};
  if (isLongRead) {
    // Long reads: gradient from dominant to complementary color
    backgroundStyle.background = `linear-gradient(90deg, ${colorToRgba(dominantColor, finalOpacity)} 0%, ${colorToRgba(complementaryColor, finalOpacity)} 100%)`;
  } else {
    // Regular reads: solid color
    backgroundStyle.backgroundColor = colorToRgba(dominantColor, finalOpacity);
  }

  return (
    <div
      ref={barRef}
      className="absolute group"
      style={{
        top: `${hoverAreaTop}px`,
        left: `${leftPercent}%`,
        width: `${minHoverWidthPercent}%`,
        height: `${hoverAreaHeight}px`,
        padding: `${hoverPadding}px 0`, // Vertical padding for larger hover area
        touchAction: 'manipulation', // Prevent double-tap zoom
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute transition-all duration-300 cursor-pointer hover:z-10"
        style={{
          top: `${hoverPadding}px`, // Position visual bar within hover area
          left: '0',
          width: `${visualBarWidthPercent}%`, // Use expanded visual width for better visibility
          height: `${barHeight}px`,
          minWidth: '2px', // Ensure very short reads are still visible
          borderRadius: '3px', // Rounded corners
          border: '1px solid rgba(255, 255, 255, 0.2)', // Thin high-contrast border
          boxShadow: isFocused 
            ? '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)', // Inner shadow for depth
          transition: 'opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          ...backgroundStyle,
        }}
      />
      
      {/* Hover Tooltip - rendered via portal */}
      {tooltipContent}
    </div>
  );
};

const YearAnalytics = ({ year, books }) => {
  // Focus state: track which book is currently hovered
  const [hoveredBookId, setHoveredBookId] = useState(null);
  // Mobile detection
  const isMobile = useIsMobile();
  
  // Safety checks - prevent crashes if props are missing
  if (!books || !Array.isArray(books)) {
    return (
      <div className="animate-fadeIn w-full max-w-5xl mx-auto px-4">
        <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-6 sm:p-8 shadow-soft text-center">
          <p className="text-text-secondary text-sm mb-2">
            No books data available
          </p>
        </div>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="animate-fadeIn w-full max-w-5xl mx-auto px-4">
        <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-6 sm:p-8 shadow-soft text-center">
          <p className="text-text-secondary text-sm mb-2">
            Year not specified
          </p>
        </div>
      </div>
    );
  }
  
  // Calculate stats
  const totalBooks = books.length;
  
  // Calculate total pages read
  const totalPages = books.reduce((sum, book) => {
    const pageCount = book.pageCount || 0;
    return sum + (typeof pageCount === 'number' ? pageCount : 0);
  }, 0);

  // Calculate fiction, non-fiction, and poetry using fictionType field
  let fictionCount = 0;
  let nonFictionCount = 0;
  let poetryCount = 0;
  
  books.forEach((book) => {
    if (!book) return;
    const fictionType = book.fictionType;
    
    if (fictionType) {
      const normalizedType = fictionType.toLowerCase().trim();
      if (normalizedType === 'fiction') {
        fictionCount++;
      } else if (normalizedType === 'non-fiction' || normalizedType === 'nonfiction') {
        nonFictionCount++;
      } else if (normalizedType === 'poetry') {
        poetryCount++;
      }
    }
  });
  
  const totalCategorized = fictionCount + nonFictionCount + poetryCount;

  // Parse datesRead field (format: "2025/07/29-2025/08/07" or "2025/03/16-2025/03/16")
  // Can also have multiple ranges: "2025/08/24-2025/08/24, 2023/04/28-2023/05/03"
  const parseDatesRead = (datesRead, targetYear) => {
    if (!datesRead || typeof datesRead !== 'string') return null;
    if (!targetYear) return null;
    
    try {
      // Handle multiple ranges separated by commas - find the one for the target year
      if (datesRead.includes(',')) {
        const ranges = datesRead.split(',').map(r => r.trim());
        // Try to find a range that matches the target year
        for (const range of ranges) {
          if (range.startsWith(String(targetYear) + '/')) {
            return parseSingleRange(range);
          }
        }
        // If no match, try to find a range that overlaps with the target year
        const targetYearStart = new Date(`${targetYear}-01-01`);
        const targetYearEnd = new Date(`${targetYear}-12-31`);
        targetYearEnd.setHours(23, 59, 59, 999);
        
        for (const range of ranges) {
          const parsed = parseSingleRange(range);
          if (parsed && parsed.start <= targetYearEnd && parsed.finish >= targetYearStart) {
            return parsed;
          }
        }
        // If still no match, return null (don't use first range if it doesn't match)
        return null;
      } else {
        // For single range, check if it overlaps with target year
        const parsed = parseSingleRange(datesRead);
        if (!parsed) return null;
        
        const targetYearStart = new Date(`${targetYear}-01-01`);
        const targetYearEnd = new Date(`${targetYear}-12-31`);
        targetYearEnd.setHours(23, 59, 59, 999);
        
        // Only return if the date range overlaps with the target year
        if (parsed.start <= targetYearEnd && parsed.finish >= targetYearStart) {
          return parsed;
        }
        return null;
      }
    } catch (error) {
      console.warn('Error parsing datesRead:', datesRead, error);
      return null;
    }
  };

  const parseSingleRange = (rangeStr) => {
    if (!rangeStr || typeof rangeStr !== 'string') return null;
    
    try {
      // Handle incomplete dates (just year or year/month) - skip these
      const parts = rangeStr.split(/[-/]/);
      if (parts.length < 3) return null; // Need at least YYYY/MM/DD format
      
      // Handle range format: "2025/07/29-2025/08/07"
      if (rangeStr.includes('-')) {
        const [startStr, finishStr] = rangeStr.split('-').map(s => s.trim());
        if (!startStr || !finishStr) return null;
        // Convert "2025/07/29" to "2025-07-29" for Date parsing
        const start = new Date(startStr.replace(/\//g, '-'));
        const finish = new Date(finishStr.replace(/\//g, '-'));
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(finish.getTime())) return null;
        
        return { start, finish, startStr, finishStr };
      } else {
        // Single date: "2025/03/16"
        const date = new Date(rangeStr.replace(/\//g, '-'));
        
        // Validate date
        if (isNaN(date.getTime())) return null;
        
        return { start: date, finish: date, startStr: rangeStr, finishStr: rangeStr };
      }
    } catch (error) {
      console.warn('Error parsing date range:', rangeStr, error);
      return null;
    }
  };

  // Process timeline data
  const timelineData = books
    .filter((book) => {
      // Support both old format (startDate/finishDate) and new format (datesRead)
      return (book.startDate && book.finishDate) || book.datesRead;
    })
    .map((book) => {
      try {
        let start, finish, startStr, finishStr;
        
        // Use new format (datesRead) if available, otherwise fall back to old format
        if (book.datesRead) {
          const parsed = parseDatesRead(book.datesRead, String(year));
          if (!parsed) return null;
          ({ start, finish, startStr, finishStr } = parsed);
        } else {
          if (!book.startDate || !book.finishDate) return null;
          start = new Date(book.startDate);
          finish = new Date(book.finishDate);
          // Validate dates
          if (isNaN(start.getTime()) || isNaN(finish.getTime())) return null;
          startStr = book.startDate;
          finishStr = book.finishDate;
        }

        const yearStart = new Date(`${year}-01-01`);
        const yearEnd = new Date(`${year}-12-31`);
        yearEnd.setHours(23, 59, 59, 999); // Set to end of year
        
        // Validate year dates
        if (isNaN(yearStart.getTime()) || isNaN(yearEnd.getTime())) return null;
        
        // Check if the book's date range overlaps with the target year at all
        // If the book's finish date is before the year starts, or start date is after the year ends, skip it
        if (finish < yearStart || start > yearEnd) {
          return null;
        }
        
        // Calculate position and width as percentage of year
        const yearDuration = yearEnd - yearStart;
        const startOffset = Math.max(0, start - yearStart);
        const finishOffset = Math.min(yearDuration, finish - yearStart);
        const leftPercent = (startOffset / yearDuration) * 100;
        const widthPercent = ((finishOffset - startOffset) / yearDuration) * 100;

        // Calculate reading duration in days
        const daysDiff = Math.ceil((finish - start) / (1000 * 60 * 60 * 24));
        const days = Math.max(1, daysDiff); // Ensure at least 1 day
        const weeksDiff = days / 7;
        const isLongRead = weeksDiff >= 4;

        return {
          ...book,
          start,
          finish,
          startStr,
          finishStr,
          leftPercent: Math.max(0, leftPercent),
          widthPercent: Math.max(1, widthPercent), // Minimum 1% width for visibility
          days,
          isLongRead,
        };
      } catch (error) {
        // Silently skip books with invalid date data
        console.warn('Error processing book for timeline:', book.id, error);
        return null;
      }
    })
    .filter(Boolean) // Remove null entries
    .sort((a, b) => a.start - b.start);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Handle both "2025-07-29" and "2025/07/29" formats
    const normalized = dateStr.replace(/\//g, '-');
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return dateStr; // Fallback if date is invalid
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get month labels for timeline
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthPositions = months.map((_, i) => (i / 12) * 100);

  // Calculate lane assignments for bars (no overlaps allowed, longest at bottom)
  const assignLanes = (books) => {
    const lanes = [];
    const BAR_HEIGHT = 28; // Fixed bar height
    const LANE_SPACING = 3; // Small spacing between bars for better readability

    // Sort books by width (longest first) so they get priority for bottom lanes
    const sortedBooks = [...books].sort((a, b) => b.widthPercent - a.widthPercent);

    sortedBooks.forEach((book) => {
      // Find a lane where this book doesn't overlap with any other book
      let assignedLane = -1;

      for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
        const lane = lanes[laneIndex];
        const hasOverlap = lane.some((otherBook) => {
          // Check if books overlap
          const bookStart = book.leftPercent;
          const bookEnd = book.leftPercent + book.widthPercent;
          const otherStart = otherBook.leftPercent;
          const otherEnd = otherBook.leftPercent + otherBook.widthPercent;

          // Check for overlap (with a small buffer to prevent touching)
          return !(bookEnd <= otherStart || bookStart >= otherEnd);
        });

        // If no overlap in this lane, use it
        if (!hasOverlap) {
          assignedLane = laneIndex;
          break;
        }
      }

      // If no lane found, create a new one
      if (assignedLane === -1) {
        assignedLane = lanes.length;
        lanes.push([]);
      }

      lanes[assignedLane].push(book);
    });

    // Calculate lane assignments for each book
    const bookLanes = new Map();
    lanes.forEach((lane, laneIndex) => {
      lane.forEach((book) => {
        bookLanes.set(book.id, laneIndex);
      });
    });

    return {
      lanes,
      getLane: (bookId) => bookLanes.get(bookId) || 0,
      totalLanes: lanes.length,
      barHeight: BAR_HEIGHT,
      laneSpacing: LANE_SPACING,
    };
  };

  const laneData = assignLanes(timelineData);
  
  // Calculate minimum width for timeline on mobile (ensure it's scrollable)
  // Use a fixed width that's wider than mobile screens to enable horizontal scrolling
  const timelineMinWidth = isMobile ? '1200px' : '100%';

  return (
    <div className="animate-fadeIn w-full max-w-5xl mx-auto px-4">
      {/* Stats Overview */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Books Read Box */}
        <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-4 sm:p-6 shadow-soft">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-accent-purple-hover mb-2">
              {totalBooks}
            </div>
            <div className="text-text-secondary text-sm sm:text-base font-medium">
              {totalBooks === 1 ? 'Book' : 'Books'} Read
            </div>
          </div>
        </div>
        
        {/* Pages Read Box */}
        <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-4 sm:p-6 shadow-soft">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-accent-purple-hover mb-2">
              {totalPages > 0 ? totalPages.toLocaleString() : '—'}
            </div>
            <div className="text-text-secondary text-sm sm:text-base font-medium">
              Pages Read
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {timelineData.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-3 sm:p-4 shadow-soft">
            {/* Mobile: Wrap timeline in horizontally scrollable container */}
            <div 
              className={isMobile ? "timeline-scroll-container" : ""}
              style={isMobile ? {
                marginLeft: '-12px',
                marginRight: '-12px',
                paddingLeft: '12px',
                paddingRight: '12px',
                width: '100%',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x pinch-zoom',
              } : {}}
            >
              {/* Timeline bars - with smart lane assignment (no overlaps, minimal spacing, longest at bottom) */}
              <div 
                className="relative mb-1.5"
                style={{
                  height: `${laneData.totalLanes * (laneData.barHeight + laneData.laneSpacing) - laneData.laneSpacing}px`,
                  minHeight: `${laneData.barHeight}px`,
                  width: isMobile ? timelineMinWidth : '100%',
                  minWidth: isMobile ? timelineMinWidth : '100%',
                }}
              >
              {/* Vertical grid lines at month boundaries */}
              <div className="absolute inset-0 pointer-events-none">
                {monthPositions.map((pos, i) => (
                  <div
                    key={`grid-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-accent-purple/10"
                    style={{ left: `${pos}%` }}
                  />
                ))}
              </div>
              {timelineData.map((book, index) => {
                const laneIndex = laneData.getLane(book.id);
                // Calculate from bottom: total height - (lane position from bottom)
                const totalHeight = laneData.totalLanes * (laneData.barHeight + laneData.laneSpacing) - laneData.laneSpacing;
                // Lane 0 is at the bottom, so invert the calculation
                const bottomOffset = laneIndex * (laneData.barHeight + laneData.laneSpacing);
                const topOffset = totalHeight - bottomOffset - laneData.barHeight;
                
                return (
                  <div
                    key={book.id}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <TimelineBar
                      book={book}
                      leftPercent={book.leftPercent}
                      widthPercent={book.widthPercent}
                      startStr={book.startStr}
                      finishStr={book.finishStr}
                      formatDate={formatDate}
                      topOffset={topOffset}
                      barHeight={laneData.barHeight}
                      hoveredBookId={hoveredBookId}
                      onHoverChange={setHoveredBookId}
                      isLongRead={book.isLongRead}
                      days={book.days}
                      isMobile={isMobile}
                    />
                  </div>
                );
              })}
              </div>

              {/* Month markers */}
              <div 
                className="relative h-5 border-t border-accent-purple/20"
                style={{
                  width: isMobile ? timelineMinWidth : '100%',
                  minWidth: isMobile ? timelineMinWidth : '100%',
                }}
              >
                {monthPositions.map((pos, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full flex flex-col items-center"
                    style={{ left: `${pos}%` }}
                  >
                    <div className="h-2 w-0.5 bg-accent-purple/60"></div>
                    <div className="text-xs text-text-primary font-medium mt-0.5 whitespace-nowrap">
                      {months[i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {timelineData.length === 0 && (
        <div className="mb-8 sm:mb-12">
          <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-6 sm:p-8 shadow-soft text-center">
            <p className="text-text-secondary text-sm mb-2">
              Timeline data not available
            </p>
            <p className="text-text-secondary text-xs">
              Add <code className="text-accent-purple/70">datesRead</code> field to books in books.json (format: "YYYY/MM/DD-YYYY/MM/DD")
            </p>
          </div>
        </div>
      )}

      {/* Genre Pie Chart */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/10 rounded-lg p-3 sm:p-4 shadow-soft">
          <h3 className="text-text-primary text-base font-semibold mb-3 text-center">
            Genre
          </h3>
          <FictionNonFictionPieChart
            fictionCount={fictionCount}
            nonFictionCount={nonFictionCount}
            poetryCount={poetryCount}
            total={totalBooks}
          />
        </div>
      </div>
    </div>
  );
};

export default YearAnalytics;
