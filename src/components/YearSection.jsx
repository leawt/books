import React from 'react';
import BookCard from './BookCard';

const YearSection = ({ year, books }) => {
  return (
    <div className="animate-fadeIn relative z-10">
      {/* Year Header */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-accent-purple/30 font-mono text-xs">✧</span>
          <h2 className="text-3xl sm:text-4xl font-normal text-text-primary tracking-tight">{year}</h2>
          <span className="text-accent-purple/30 font-mono text-xs">✦</span>
        </div>
        <p className="text-text-secondary text-sm sm:text-base font-normal">{books.length} {books.length === 1 ? 'book' : 'books'} read</p>
        <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-3 sm:mt-4"></div>
      </div>

      {/* Books Grid - Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default YearSection;
