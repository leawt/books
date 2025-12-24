import React, { useState } from 'react';
import booksData from '../data/books.json';
import YearSection from './YearSection';

const BooksSection = () => {
  const years = Object.keys(booksData).sort((a, b) => b - a); // Sort descending (most recent first)
  const [selectedYear, setSelectedYear] = useState(years[0]); // Default to most recent year

  return (
    <div className="mt-8 sm:mt-12">
      {/* Year Selector Dropdown */}
      <div className="flex justify-center mb-8 sm:mb-12 px-4">
        <div className="relative inline-block w-full sm:w-auto">
          <label htmlFor="year-select" className="block text-xs sm:text-sm font-light text-text-secondary mb-2 text-center">
            Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none w-full sm:w-auto bg-background border border-accent-purple/40 text-text-primary 
                     px-6 sm:px-8 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-md
                     focus:outline-none focus:border-accent-purple-hover focus:ring-1 focus:ring-accent-purple/30
                     shadow-soft hover:shadow-soft-lg transition-all duration-300
                     cursor-pointer text-sm sm:text-base font-light"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-background text-text-primary">
                {year} ({booksData[year].length} books)
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

      {/* Display selected year's books */}
      <YearSection year={selectedYear} books={booksData[selectedYear]} />
    </div>
  );
};

export default BooksSection;
