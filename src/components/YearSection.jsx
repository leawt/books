import React from 'react';
import BookCard from './BookCard';

const YearSection = ({ year, books }) => {
  return (
    <div className="animate-fadeIn relative z-10">
      {/* Header with book count */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <p className="text-text-secondary text-sm sm:text-base font-medium">{books.length} {books.length === 1 ? 'book' : 'books'} read</p>
        <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-3 sm:mt-4"></div>
      </div>

      {/* Books Grid - Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 justify-items-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default YearSection;
