import React, { useState, useEffect } from 'react';
import booksData from '../data/books.json';
import YearSection from './YearSection';

const BooksSection = ({ onNavigateToFavorites }) => {
  const years = Object.keys(booksData).sort((a, b) => b - a); // Sort descending (most recent first)
  const [selectedYear, setSelectedYear] = useState(years[0]); // Default to most recent year
  const [selectedFilter, setSelectedFilter] = useState(null); // null means "All Books"

  // Reset filter when year changes
  useEffect(() => {
    setSelectedFilter(null);
  }, [selectedYear]);

  // Get year data - handle both old and new structure for backward compatibility
  const getYearData = (year) => {
    const yearData = booksData[year];
    // Check if it's the new structure (object with books and filters)
    if (yearData && typeof yearData === 'object' && !Array.isArray(yearData) && yearData.books) {
      return yearData;
    }
    // Old structure (array) - convert to new structure
    return {
      books: Array.isArray(yearData) ? yearData : [],
      filters: {}
    };
  };

  const yearData = getYearData(selectedYear);
  const allBooks = yearData.books || [];
  const filters = yearData.filters || {};

  // Filter books based on selected filter
  const getFilteredBooks = () => {
    if (!selectedFilter || !filters[selectedFilter]) {
      return allBooks;
    }
    const filterBookIds = filters[selectedFilter];
    return allBooks.filter(book => filterBookIds.includes(book.id));
  };

  const filteredBooks = getFilteredBooks();

  return (
    <div className="mt-8 sm:mt-12 flex flex-col items-center">
      {/* Favorite's Shelf Link */}
      {onNavigateToFavorites && (
        <div className="mb-4 sm:mb-6 px-4 w-full flex flex-col items-center">
          <div
            onClick={onNavigateToFavorites}
            className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 
                     text-sm sm:text-base font-bold cursor-pointer
                     transition-all duration-300"
            style={{
              color: 'rgba(139, 123, 168, 1)', // Lilac color - more readable
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(139, 123, 168, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(139, 123, 168, 1)';
            }}
          >
            <span className="text-accent-purple/70 group-hover:text-accent-purple transition-colors duration-300">★</span>
            <span className="relative">
              Favorite's Shelf
              <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-purple/60 group-hover:w-full transition-all duration-300"></span>
            </span>
            <span className="text-accent-purple/30 group-hover:text-accent-purple/50 transition-colors duration-300">→</span>
          </div>
          {/* Divider line */}
          <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-4 sm:mt-5"></div>
        </div>
      )}

      {/* Year Selector Dropdown */}
      <div className="flex justify-center mb-8 sm:mb-12 px-4 w-full">
        <div className="relative inline-block w-full sm:w-auto">
          <label htmlFor="year-select" className="block text-xs sm:text-sm font-light text-text-secondary mb-2 text-center">
            Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none w-full sm:w-auto bg-background/80 backdrop-blur-sm border border-accent-purple/40 text-text-primary 
                     px-6 sm:px-8 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-md
                     focus:outline-none focus:border-accent-purple-hover focus:ring-1 focus:ring-accent-purple/30
                     shadow-soft hover:shadow-soft-lg transition-all duration-300
                     cursor-pointer text-sm sm:text-base font-medium"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-background text-text-primary">
                {year}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-accent-purple top-7 sm:top-8">
            <svg className="fill-current h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Display selected year's books with filters */}
      <YearSection 
        year={selectedYear} 
        books={filteredBooks}
        allBooks={allBooks}
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </div>
  );
};

export default BooksSection;
