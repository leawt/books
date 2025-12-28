import React, { useState, useEffect, useRef } from 'react';
import BookCard from './BookCard';
import YearAnalytics from './YearAnalytics';
import { useIsMobile } from '../utils/mobileDetection';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a copy to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const YearSection = ({ year, books, allBooks, filters = {}, selectedFilter, onFilterChange }) => {
  const isMobile = useIsMobile();
  
  // Initialize viewMode from localStorage, default to 'collection'
  const getInitialViewMode = () => {
    const savedViewMode = localStorage.getItem('yearSectionViewMode');
    // Handle backward compatibility: migrate 'collections' to 'collection'
    if (savedViewMode === 'collections') {
      localStorage.setItem('yearSectionViewMode', 'collection');
      return 'collection';
    }
    if (savedViewMode && ['collection', 'analytics'].includes(savedViewMode)) {
      return savedViewMode;
    }
    return 'collection';
  };

  // Initialize zoom level from localStorage (mobile only, 2-5 columns)
  const getInitialZoomLevel = () => {
    if (!isMobile) return null; // Desktop uses responsive breakpoints
    const savedZoom = localStorage.getItem('booksGridZoomLevel');
    if (savedZoom) {
      const zoom = parseInt(savedZoom, 10);
      if (zoom >= 2 && zoom <= 5) return zoom;
    }
    return 2; // Default to 2 columns on mobile
  };

  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'fadingOut', 'fadingIn'
  const [displayBooks, setDisplayBooks] = useState(() => shuffleArray(books)); // Shuffle on initial render
  const [zoomLevel, setZoomLevel] = useState(getInitialZoomLevel); // 2-5 columns on mobile
  const previousYearRef = useRef(null); // Initialize to null to detect first render
  const previousBooksRef = useRef(books);
  
  // Pinch zoom state
  const pinchStartDistance = useRef(null);
  const pinchStartZoom = useRef(null);
  const lastZoomUpdate = useRef(null);
  const gridContainerRef = useRef(null);

  // Persist viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('yearSectionViewMode', viewMode);
  }, [viewMode]);

  // Persist zoom level to localStorage (mobile only)
  useEffect(() => {
    if (isMobile && zoomLevel !== null) {
      localStorage.setItem('booksGridZoomLevel', zoomLevel.toString());
    }
  }, [zoomLevel, isMobile]);

  // Reset zoom level when switching between mobile/desktop
  useEffect(() => {
    if (isMobile) {
      // On mobile, ensure zoom level is set (2-5)
      const savedZoom = localStorage.getItem('booksGridZoomLevel');
      const parsedZoom = savedZoom ? parseInt(savedZoom, 10) : 2;
      const validZoom = Math.max(2, Math.min(5, parsedZoom));
      if (zoomLevel !== validZoom) {
        setZoomLevel(validZoom);
      }
    } else {
      // On desktop, zoom level should be null (use responsive breakpoints)
      if (zoomLevel !== null) {
        setZoomLevel(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Calculate distance between two touch points
  const getTouchDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start for pinch detection
  const handleTouchStart = (e) => {
    if (!isMobile || e.touches.length !== 2) return;
    
    // Only handle pinch gestures (2 touches)
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    pinchStartDistance.current = getTouchDistance(touch1, touch2);
    pinchStartZoom.current = zoomLevel;
    e.preventDefault(); // Prevent default pinch zoom behavior
    e.stopPropagation(); // Prevent book card touch handlers from firing
  };

  // Handle touch move for pinch zoom
  const handleTouchMove = (e) => {
    if (!isMobile || e.touches.length !== 2 || pinchStartDistance.current === null) return;
    
    // Only handle pinch gestures (2 touches)
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = getTouchDistance(touch1, touch2);
    
    if (pinchStartDistance.current > 0) {
      const scale = currentDistance / pinchStartDistance.current;
      const threshold = 0.1; // Reduced threshold for smoother, more responsive zoom
      
      // REVERSED: Pinch out (fingers moving away) = fewer columns (5->2)
      // Pinch in (fingers moving together) = more columns (2->5)
      if (scale > 1 + threshold) {
        // Pinch out - decrease columns (zoom out visually)
        const newZoom = Math.max(2, pinchStartZoom.current - 1);
        if (newZoom !== zoomLevel && Date.now() - (lastZoomUpdate.current || 0) > 50) {
          setZoomLevel(newZoom);
          pinchStartZoom.current = newZoom;
          pinchStartDistance.current = currentDistance;
          lastZoomUpdate.current = Date.now();
        }
      } else if (scale < 1 - threshold) {
        // Pinch in - increase columns (zoom in visually)
        const newZoom = Math.min(5, pinchStartZoom.current + 1);
        if (newZoom !== zoomLevel && Date.now() - (lastZoomUpdate.current || 0) > 50) {
          setZoomLevel(newZoom);
          pinchStartZoom.current = newZoom;
          pinchStartDistance.current = currentDistance;
          lastZoomUpdate.current = Date.now();
        }
      }
    }
    
    e.preventDefault();
    e.stopPropagation(); // Prevent book card touch handlers from firing
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    pinchStartDistance.current = null;
    pinchStartZoom.current = null;
    lastZoomUpdate.current = null;
  };

  // Track year changes and trigger animation (only in collection view)
  useEffect(() => {
    const isInitialRender = previousYearRef.current === null;
    const yearChanged = !isInitialRender && previousYearRef.current !== year;
    
    if (viewMode === 'collection' && yearChanged) {
      // Year changed - keep showing current displayBooks (old books) and start fade out animation
      // displayBooks already contains the previous books, so we don't need to change it
      setAnimationPhase('fadingOut');
      
      // After fade out completes, shuffle and update to new books, then start fade in
      const fadeOutTimeout = setTimeout(() => {
        const shuffledBooks = shuffleArray(books);
        setDisplayBooks(shuffledBooks);
        setAnimationPhase('fadingIn');
        
        // After fade in completes, reset to idle
        const fadeInTimeout = setTimeout(() => {
          setAnimationPhase('idle');
        }, 500 + (Math.min(books.length, 15) * 50)); // 500ms base + 50ms per book (capped)
        
        return () => clearTimeout(fadeInTimeout);
      }, 300); // Fade out duration
      
      previousYearRef.current = year;
      previousBooksRef.current = books;
      
      return () => clearTimeout(fadeOutTimeout);
    } else if (viewMode === 'collection') {
      // Same year - this is either initial render or filter change
      if (isInitialRender) {
        // First render - already shuffled in useState, just update refs
        previousYearRef.current = year;
        previousBooksRef.current = books;
      } else {
        // Filter change - keep same order, just update books
        setDisplayBooks(books);
      }
      setAnimationPhase('idle');
    } else {
      // Analytics view or view mode change - just update without animation or shuffling
      setDisplayBooks(books);
      setAnimationPhase('idle');
      if (previousYearRef.current !== year) {
        previousYearRef.current = year;
        previousBooksRef.current = books;
      }
    }
  }, [year, books, viewMode]);
  const filterKeys = Object.keys(filters);
  const hasFilters = filterKeys.length > 0;

  // Format filter name for display (convert kebab-case to title case)
  const formatFilterName = (filterKey) => {
    return filterKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Use allBooks for analytics, fallback to books if not provided
  const booksForAnalytics = allBooks || books;

  return (
    <div className="animate-fadeIn relative z-10 w-full">
      {/* Segmented Control - Main View Toggle */}
      <div className="mb-6 sm:mb-8 px-4">
        <div className="flex justify-center">
          <div className="inline-flex bg-background/60 backdrop-blur-sm border border-accent-purple/20 rounded-lg p-1 shadow-soft">
            <button
              onClick={() => setViewMode('collection')}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
                viewMode === 'collection'
                  ? 'bg-accent-purple/20 text-accent-purple-hover shadow-soft'
                  : 'text-text-secondary hover:text-accent-purple-hover'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
                viewMode === 'analytics'
                  ? 'bg-accent-purple/20 text-accent-purple-hover shadow-soft'
                  : 'text-text-secondary hover:text-accent-purple-hover'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <YearAnalytics year={year} books={booksForAnalytics} />
      )}

      {/* Collection View */}
      {viewMode === 'collection' && (
        <>
          {/* Filter Tabs */}
          {hasFilters && (
            <div className="mb-6 sm:mb-8 px-4">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                {/* All Books tab */}
                <button
                  onClick={() => onFilterChange(null)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
                    selectedFilter === null
                      ? 'bg-accent-purple/20 text-accent-purple-hover border border-accent-purple/40 shadow-soft'
                      : 'bg-background/60 text-text-secondary border border-accent-purple/20 hover:bg-accent-purple/10 hover:text-accent-purple-hover hover:border-accent-purple/30'
                  }`}
                >
                  All Books
                </button>
                {/* Filter tabs */}
                {filterKeys.map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => onFilterChange(filterKey)}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
                      selectedFilter === filterKey
                        ? 'bg-accent-purple/20 text-accent-purple-hover border border-accent-purple/40 shadow-soft'
                        : 'bg-background/60 text-text-secondary border border-accent-purple/20 hover:bg-accent-purple/10 hover:text-accent-purple-hover hover:border-accent-purple/30'
                    }`}
                  >
                    {formatFilterName(filterKey)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Books Grid - Responsive: 2 cols on mobile (zoomable 2-5), 3 on tablet, 4 on desktop */}
          <div 
            ref={gridContainerRef}
            className={`grid gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 justify-items-center transition-all duration-300 ease-in-out ${
              isMobile && zoomLevel !== null
                ? zoomLevel === 2 ? 'grid-cols-2' :
                  zoomLevel === 3 ? 'grid-cols-3' :
                  zoomLevel === 4 ? 'grid-cols-4' :
                  zoomLevel === 5 ? 'grid-cols-5' : 'grid-cols-2'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={isMobile ? { touchAction: 'pan-y' } : {}}
          >
            {displayBooks.map((book, index) => {
              // Determine animation classes based on phase
              let animationClasses = '';
              if (animationPhase === 'fadingOut') {
                animationClasses = 'animate-fadeOut';
              } else if (animationPhase === 'fadingIn') {
                // Apply staggered fade in with delay based on index
                const staggerIndex = Math.min(index, 15); // Cap at 15 for our delay classes
                animationClasses = `animate-fadeInStagger stagger-delay-${staggerIndex}`;
              }
              
              return (
                <div 
                  key={book.id} 
                  className={`w-full ${animationClasses}`}
                  style={{ aspectRatio: '2/3' }}
                >
                  <BookCard book={book} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default YearSection;
