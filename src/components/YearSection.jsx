import React from 'react';
import BookCard from './BookCard';

const YearSection = ({ year, books }) => {
  return (
    <div className="animate-fadeIn">
      {/* Year Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-purple-300 mb-2">{year}</h2>
        <p className="text-slate-400">{books.length} {books.length === 1 ? 'book' : 'books'} read</p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-4 shadow-sm shadow-purple-500/50"></div>
      </div>

      {/* Books Grid - 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default YearSection;
