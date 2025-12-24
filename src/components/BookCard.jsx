import React, { useState } from 'react';

const BookCard = ({ book }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="book-card-container perspective-1000 w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] mx-auto"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      onTouchStart={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`book-card-inner relative w-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ 
          aspectRatio: '2/3',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of card - Book Cover */}
        <div 
          className="book-face book-front absolute w-full h-full backface-hidden rounded-lg overflow-hidden
                     shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-accent-purple/20"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {book.coverImage ? (
            <>
              <img 
                src={book.coverImage} 
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-accent-purple/20 hidden items-center justify-center flex-col text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2">📚</div>
                <div className="text-text-primary text-xs font-normal">{book.title}</div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-accent-purple/20 flex items-center justify-center flex-col text-center p-3 sm:p-4">
              <div className="text-3xl sm:text-4xl mb-2">📚</div>
              <div className="text-text-primary text-xs font-normal">{book.title}</div>
            </div>
          )}
        </div>

        {/* Back of card - Title & Author */}
        <div 
          className="book-face book-back absolute w-full h-full backface-hidden rounded-lg overflow-hidden
                     bg-background border border-accent-purple/30 shadow-soft-lg
                     flex flex-col items-center justify-center p-4 sm:p-6 text-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="relative z-10 w-full">
            <h3 className="text-base sm:text-lg md:text-xl font-normal text-text-primary mb-3 leading-tight px-2 font-serif">
              {book.title}
            </h3>
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-accent-purple/30 font-mono text-xs">✧</span>
              <div className="h-px w-12 sm:w-16 bg-accent-purple/40"></div>
              <span className="text-accent-purple/30 font-mono text-xs">✦</span>
            </div>
            <p className="text-text-secondary text-xs sm:text-sm font-normal px-2">
              {book.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
