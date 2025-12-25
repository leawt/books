import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Utility function to extract dominant color from an image
const extractDominantColor = (imageUrl, callback) => {
  if (!imageUrl) {
    callback('#8B7BA8'); // Default purple color
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
      let dominantColor = '#8B7BA8'; // Default
      
      for (const [colorKey, count] of Object.entries(colorMap)) {
        if (count > maxCount) {
          maxCount = count;
          const [r, g, b] = colorKey.split(',').map(Number);
          dominantColor = `rgb(${r}, ${g}, ${b})`;
        }
      }
      
      callback(dominantColor);
    } catch (error) {
      console.error('Error extracting color:', error);
      callback('#8B7BA8'); // Fallback to default
    }
  };
  
  img.onerror = () => {
    callback('#8B7BA8'); // Fallback to default on error
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

// Timeline bar component with hover tooltip
const TimelineBar = ({ book, leftPercent, widthPercent, startStr, finishStr, formatDate, topOffset, barHeight = 10, hoveredBookId, onHoverChange, isLongRead = false }) => {
  const [dominantColor, setDominantColor] = useState('#8B7BA8');
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const barRef = useRef(null);
  const tooltipRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const tooltipDimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (book.coverImage) {
      extractDominantColor(book.coverImage, (color) => {
        setDominantColor(color);
      });
    }
  }, [book.coverImage]);

  // Function to calculate and update tooltip position
  const updateTooltipPosition = (x, y) => {
    if (!tooltipRef.current) return;
    
    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 12;
    const offsetX = 8; // Reduced offset from cursor for closer positioning
    const offsetY = 8; // Reduced offset from cursor for closer positioning
    
    // Calculate position near cursor
    let leftPos = x + offsetX;
    let topPos = y + offsetY;
    
    // Keep tooltip within viewport with padding
    if (leftPos + tooltipRect.width > window.innerWidth - padding) {
      leftPos = x - tooltipRect.width - offsetX;
    }
    if (leftPos < padding) {
      leftPos = padding;
    }
    
    if (topPos + tooltipRect.height > window.innerHeight - padding) {
      topPos = y - tooltipRect.height - offsetY;
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
      if (tooltipRef.current && isHovered && mousePosition.x > 0 && mousePosition.y > 0) {
        updateTooltipPosition(mousePosition.x, mousePosition.y);
      }
    };
    
    // Use double RAF to ensure DOM is ready when tooltip first appears
    let rafId1 = requestAnimationFrame(() => {
      rafId1 = requestAnimationFrame(updatePosition);
    });
    
    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
    };
  }, [isHovered]);

  // Continuously update position as mouse moves
  useEffect(() => {
    if (!isHovered || !tooltipRef.current) return;
    
    // Update position using requestAnimationFrame for smooth updates
    const rafId = requestAnimationFrame(() => {
      if (tooltipRef.current && isHovered) {
        updateTooltipPosition(mousePosition.x, mousePosition.y);
      }
    });
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [mousePosition.x, mousePosition.y, isHovered]);

  const handleMouseEnter = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:162',message:'Mouse enter',data:{bookId:book.id,bookTitle:book.title,currentIsHovered:isHovered,hasPendingHide:!!hideTimeoutRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // Clear any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    // Show after short delay to prevent flickering but not too fast
    showTimeoutRef.current = setTimeout(() => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:170',message:'Setting hovered to true',data:{bookId:book.id,bookTitle:book.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setIsHovered(true);
      // Notify parent component of hover state change for focus effect
      onHoverChange?.(book.id);
    }, 30);
  };

  const handleMouseLeave = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:174',message:'Mouse leave',data:{bookId:book.id,bookTitle:book.title,currentIsHovered:isHovered,hasPendingShow:!!showTimeoutRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    // Clear any pending show
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    // Hide after delay to allow smooth transitions between bars
    hideTimeoutRef.current = setTimeout(() => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:182',message:'Setting hovered to false',data:{bookId:book.id,bookTitle:book.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setIsHovered(false);
      // Notify parent component to clear focus state
      onHoverChange?.(null);
    }, 100);
  };

  const handleMouseMove = (e) => {
    // Always update mouse position to track cursor
    const newPosition = { x: e.clientX, y: e.clientY };
    setMousePosition(newPosition);
  };

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

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:244',message:'Calculating visual bar width',data:{bookId:book.id,originalWidthPercent:widthPercent,minHoverWidthPercent,visualBarWidthAsPercentOfContainer,visualBarWidthPercent,minVisualBarPercentOfContainer},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix-v2',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

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
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute rounded-sm transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:opacity-90 hover:z-10"
        style={{
          top: `${hoverPadding}px`, // Position visual bar within hover area
          left: '0',
          width: `${visualBarWidthPercent}%`, // Use expanded visual width for better visibility
          height: `${barHeight}px`,
          backgroundColor: dominantColor,
          minWidth: '2px', // Ensure very short reads are still visible
          // Focus state: dim other bars when one is hovered
          opacity: hoveredBookId && hoveredBookId !== book.id ? 0.4 : 1.0,
          transition: 'opacity 0.2s ease-in-out',
          // Long-read visual: apply smooth gradient fade for books spanning 4+ weeks
          ...(isLongRead && {
            background: `linear-gradient(90deg, ${dominantColor} 0%, ${colorToRgba(dominantColor, 0.95)} 30%, ${colorToRgba(dominantColor, 0.85)} 70%, ${colorToRgba(dominantColor, 0.75)} 100%)`,
          }),
        }}
      />
      {/* #region agent log */}
      {(() => {
        fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:261',message:'Rendering visual bar',data:{bookId:book.id,widthPercent,barHeight,minHoverWidthPercent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        return null;
      })()}
      {/* #endregion */}
      
      {/* Hover Tooltip - rendered via portal */}
      {tooltipContent}
    </div>
  );
};

const YearAnalytics = ({ year, books }) => {
  // Focus state: track which book is currently hovered
  const [hoveredBookId, setHoveredBookId] = useState(null);
  
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

  // Extract genres and count them
  const genreCounts = {};
  books.forEach((book) => {
    if (!book) return;
    const genres = book.genres || (book.genre ? [book.genre] : []);
    if (Array.isArray(genres)) {
      genres.forEach((genre) => {
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      });
    }
  });

  // Sort genres by count (descending)
  const sortedGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10); // Top 10 genres

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
        // If no match, use the first range
        return parseSingleRange(ranges[0]);
      } else {
        return parseSingleRange(datesRead);
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
        
        // Validate year dates
        if (isNaN(yearStart.getTime()) || isNaN(yearEnd.getTime())) return null;
        
        // Calculate position and width as percentage of year
        const yearDuration = yearEnd - yearStart;
        const startOffset = Math.max(0, start - yearStart);
        const finishOffset = Math.min(yearDuration, finish - yearStart);
        const leftPercent = (startOffset / yearDuration) * 100;
        const widthPercent = ((finishOffset - startOffset) / yearDuration) * 100;

        // Calculate reading duration in weeks to detect long reads (4+ weeks)
        const weeksDiff = (finish - start) / (1000 * 60 * 60 * 24 * 7);
        const isLongRead = weeksDiff >= 4;

        // #region agent log
        const monthsDiff = (finish - start) / (1000 * 60 * 60 * 24 * 30); // Approximate months
        fetch('http://127.0.0.1:7242/ingest/3469e0bd-e8a3-48c7-afd9-549ad798475d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'YearAnalytics.jsx:371',message:'Calculated bar dimensions',data:{bookId:book.id,bookTitle:book.title,leftPercent,widthPercent,startStr,finishStr,monthsDiff,isLongRead},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        return {
          ...book,
          start,
          finish,
          startStr,
          finishStr,
          leftPercent: Math.max(0, leftPercent),
          widthPercent: Math.max(1, widthPercent), // Minimum 1% width for visibility
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
    const BAR_HEIGHT = 28; // Increased bar height for better visibility
    const LANE_SPACING = 0; // Bars touch each other

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

  return (
    <div className="animate-fadeIn w-full max-w-5xl mx-auto px-4">
      {/* Stats Overview */}
      <div className="mb-6 sm:mb-8">
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
            Reading Statistics
          </h3>
          <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-2"></div>
        </div>
        
        <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-4 sm:p-6 shadow-soft">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-accent-purple-hover mb-2">
              {totalBooks}
            </div>
            <div className="text-text-secondary text-sm sm:text-base font-medium">
              {totalBooks === 1 ? 'Book' : 'Books'} Read in {year}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {timelineData.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
              Reading Timeline
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mb-4">
              When you read each book throughout the year
            </p>
            <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-3"></div>
          </div>

          <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-3 sm:p-4 shadow-soft">
            {/* Timeline bars - with smart lane assignment (no overlaps, minimal spacing, longest at bottom) */}
            <div 
              className="relative mb-1.5"
              style={{
                height: `${laneData.totalLanes * (laneData.barHeight + laneData.laneSpacing) - laneData.laneSpacing}px`,
                minHeight: `${laneData.barHeight}px`,
              }}
            >
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
                    />
                  </div>
                );
              })}
            </div>

            {/* Month markers */}
            <div className="relative h-5 border-t border-accent-purple/20">
              {monthPositions.map((pos, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full flex flex-col items-center"
                  style={{ left: `${pos}%` }}
                >
                  <div className="h-1.5 w-px bg-accent-purple/30"></div>
                  <div className="text-xs text-text-secondary mt-0.5 whitespace-nowrap">
                    {months[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {timelineData.length === 0 && (
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
              Reading Timeline
            </h3>
            <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-3"></div>
          </div>
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

      {/* Genre Breakdown */}
      {sortedGenres.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
              Genre Breakdown
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mb-3">
              Distribution of genres read this year
            </p>
            <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-2"></div>
          </div>

          <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-3 sm:p-4 shadow-soft">
            <div className="space-y-2 sm:space-y-2.5">
              {sortedGenres.map(([genre, count], index) => {
                const maxCount = sortedGenres[0][1];
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div
                    key={genre}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      animation: 'fadeIn 0.4s ease-out forwards',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm sm:text-base font-medium text-text-primary">
                        {genre}
                      </span>
                      <span className="text-xs sm:text-sm text-text-secondary font-medium">
                        {count} {count === 1 ? 'book' : 'books'}
                      </span>
                    </div>
                    <div className="h-6 sm:h-8 bg-accent-purple/10 rounded-md overflow-hidden border border-accent-purple/20">
                      <div
                        className="h-full bg-gradient-to-r from-accent-purple/40 to-accent-purple/60 rounded-md transition-all duration-500 ease-out flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-xs text-text-primary font-medium">
                            {Math.round(percentage)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {sortedGenres.length === 0 && (
        <div className="mb-8 sm:mb-12">
          <div className="bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-6 sm:p-8 shadow-soft text-center">
            <p className="text-text-secondary text-sm mb-2">
              Genre data not available
            </p>
            <p className="text-text-secondary text-xs">
              Add <code className="text-accent-purple/70">genre</code> or <code className="text-accent-purple/70">genres</code> fields to books in books.json
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearAnalytics;

