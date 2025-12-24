import React, { useState } from 'react';
import booksData from '../data/books.json';
import YearSection from './YearSection';

const BooksSection = () => {
  const years = Object.keys(booksData).sort((a, b) => b - a); // Sort descending (most recent first)
  const [selectedYear, setSelectedYear] = useState(years[0]); // Default to most recent year

  return (
    <div className="mt-12">
      {/* Year Selector Dropdown */}
      <div className="flex justify-center mb-12">
        <div className="relative inline-block">
          <label htmlFor="year-select" className="block text-sm font-medium text-purple-300 mb-2 text-center">
            Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-slate-800/50 border-2 border-purple-500/30 text-white px-8 py-3 pr-12 rounded-lg 
                     focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20
                     shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300
                     backdrop-blur-sm cursor-pointer text-lg font-medium"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-slate-900">
                {year} ({booksData[year].length} books)
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-400 top-7">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
