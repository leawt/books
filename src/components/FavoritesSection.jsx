import React from 'react';
import booksData from '../data/books.json';
import FavoritesBookCard from './FavoritesBookCard';

const FavoritesSection = ({ onNavigateBack }) => {
  // Aggregate all favorite books from all years
  const getFavorites = () => {
    const favorites = [];
    
    Object.keys(booksData).forEach((year) => {
      const yearData = booksData[year];
      
      // Handle both old and new structure
      let books = [];
      if (yearData && typeof yearData === 'object' && !Array.isArray(yearData) && yearData.books) {
        books = yearData.books || [];
      } else if (Array.isArray(yearData)) {
        books = yearData;
      }
      
      // Find books marked as favorite
      // Support both old format (favorite: true) and new format (tags: ["favorites"])
      books.forEach((book) => {
        const isFavorite = book.favorite === true || 
                          (Array.isArray(book.tags) && book.tags.includes('favorites'));
        if (isFavorite) {
          favorites.push({
            ...book,
            yearRead: year
          });
        }
      });
    });
    
    // Sort by year (most recent first), then by original order
    return favorites.sort((a, b) => {
      const yearDiff = parseInt(b.yearRead) - parseInt(a.yearRead);
      if (yearDiff !== 0) return yearDiff;
      // If same year, maintain original order (by id)
      return a.id.localeCompare(b.id);
    });
  };

  const favorites = getFavorites();

  if (favorites.length === 0) {
    return (
      <div className="mt-8 sm:mt-12 flex flex-col items-center animate-fadeIn">
        {/* Back Navigation */}
        {onNavigateBack && (
          <div className="mb-6 sm:mb-8 px-4 w-full flex justify-center">
            <div
              onClick={onNavigateBack}
              className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 
                       text-sm sm:text-base font-medium text-text-primary
                       transition-all duration-300 cursor-pointer
                       hover:text-accent-purple-hover"
            >
              <span className="text-accent-purple/20 group-hover:text-accent-purple/40 transition-colors duration-300">←</span>
              <span className="relative">
                Back
                <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-purple/60 group-hover:w-full transition-all duration-300"></span>
              </span>
            </div>
          </div>
        )}

        <div className="text-center px-4">
          <p className="text-text-secondary text-base sm:text-lg font-medium mb-4">
            No favorites yet
          </p>
          <p className="text-text-secondary text-sm">
            Mark books as favorites by adding <code className="text-accent-purple/70">"favorites"</code> to the <code className="text-accent-purple/70">tags</code> array in books.json
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-12 flex flex-col items-center animate-fadeIn">
      {/* Back Navigation */}
      {onNavigateBack && (
        <div className="mb-6 sm:mb-8 px-4 w-full flex justify-center">
          <div
            onClick={onNavigateBack}
            className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 
                     text-sm sm:text-base font-medium text-text-primary
                     transition-all duration-300 cursor-pointer
                     hover:text-accent-purple-hover"
          >
            <span className="text-accent-purple/20 group-hover:text-accent-purple/40 transition-colors duration-300">←</span>
            <span className="relative">
              Back
              <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-purple/60 group-hover:w-full transition-all duration-300"></span>
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary mb-3">
          All-Time Favorites
        </h2>
        <div className="h-px w-20 sm:w-32 bg-accent-purple/40 mx-auto mt-3 sm:mt-4"></div>
      </div>

      {/* Favorites Grid with staggered animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 max-w-7xl mx-auto px-4 justify-items-center w-full">
        {favorites.map((book, index) => (
          <div
            key={book.id}
            className="favorite-book-wrapper"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <FavoritesBookCard book={book} yearRead={book.yearRead} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;

