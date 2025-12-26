import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import YearAnalytics from './YearAnalytics';

const YearSection = ({ year, books, allBooks, filters = {}, selectedFilter, onFilterChange }) => {
  // Initialize viewMode from localStorage, default to 'collections'
  const getInitialViewMode = () => {
    const savedViewMode = localStorage.getItem('yearSectionViewMode');
    if (savedViewMode && ['collections', 'analytics'].includes(savedViewMode)) {
      return savedViewMode;
    }
    return 'collections';
  };

  const [viewMode, setViewMode] = useState(getInitialViewMode);

  // Persist viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('yearSectionViewMode', viewMode);
  }, [viewMode]);
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
              onClick={() => setViewMode('collections')}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 ${
                viewMode === 'collections'
                  ? 'bg-accent-purple/20 text-accent-purple-hover shadow-soft'
                  : 'text-text-secondary hover:text-accent-purple-hover'
              }`}
            >
              Collections
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

      {/* Collections View */}
      {viewMode === 'collections' && (
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

          {/* Books Grid - Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 justify-items-center">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default YearSection;
