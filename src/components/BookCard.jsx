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
                     border border-accent-purple/20 shadow-soft-lg
                     flex flex-col items-center justify-center p-4 sm:p-6 text-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: 'rgba(250, 248, 243, 0.85)',
            position: 'relative'
          }}
        >
          {/* Grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Sparkle effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent-purple/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent-purple/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-0.5 h-0.5 bg-accent-purple/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent-purple/35 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-1/3 right-1/2 w-0.5 h-0.5 bg-accent-purple/45 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10 w-full">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-text-primary mb-3 leading-tight px-2 break-words" 
                style={{
                  fontSize: book.title.length > 50 ? '0.65rem' : book.title.length > 30 ? '0.75rem' : undefined
                }}>
              {book.title}
            </h3>
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-accent-purple/20 font-mono text-xs">✧</span>
              <div className="h-px w-12 sm:w-16 bg-accent-purple/30"></div>
              <span className="text-accent-purple/20 font-mono text-xs">✦</span>
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
